const db = require('../db/connection');
const cloudinary = require('cloudinary').v2;

const PACKAGE_TYPE_LABEL_TO_ENUM = {
  'Beach Side': 'BEACH SIDE',
  'Hill Country': 'HILL COUNTRY',
  'Safari': 'SAFARI',
  'Cultural Heritage': 'CULTURAL HERITAGE',
  'Adventure': 'ADVENTURE',
  'Wellness & Ayurveda': 'WELLNESS & AYURVEDA',
};

const PACKAGE_TYPE_ENUM_TO_LABEL = Object.entries(PACKAGE_TYPE_LABEL_TO_ENUM)
  .reduce((acc, [label, enumValue]) => {
    acc[enumValue] = label;
    return acc;
  }, {});

const toPackageTypeEnum = (value) => {
  if (value == null) return null;
  const raw = String(value).trim();
  if (PACKAGE_TYPE_LABEL_TO_ENUM[raw]) return PACKAGE_TYPE_LABEL_TO_ENUM[raw];

  const normalized = raw.toUpperCase().replace(/\s+/g, ' ');
  return PACKAGE_TYPE_ENUM_TO_LABEL[normalized] ? normalized : null;
};

const toPackageTypeLabel = (value) => {
  if (value == null) return null;
  const normalized = String(value).trim().toUpperCase().replace(/\s+/g, ' ');
  return PACKAGE_TYPE_ENUM_TO_LABEL[normalized] || value;
};

let packageSchemaCache = null;
let guidSchemaCache = null;
const PACKAGE_TYPE_META_PREFIX = '[[PKG_TYPE:';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getPackageSchemaMeta = async () => {
  if (packageSchemaCache) return packageSchemaCache;

  const [columns] = await db.execute('SHOW COLUMNS FROM package');
  const byName = columns.reduce((acc, col) => {
    acc[col.Field] = col;
    return acc;
  }, {});

  packageSchemaCache = {
    hasType: Boolean(byName.type),
    hasDays: Boolean(byName.days),
    daysType: byName.days ? String(byName.days.Type || '').toLowerCase() : '',
    hasImageUrl: Boolean(byName.image_url),
    hasDescription: Boolean(byName.description),
    hasGuidId: Boolean(byName.guid_id),
  };

  return packageSchemaCache;
};

const getGuidSchemaMeta = async () => {
  if (guidSchemaCache) return guidSchemaCache;

  const [tables] = await db.execute("SHOW TABLES LIKE 'guid'");
  if (!tables.length) {
    guidSchemaCache = { hasTable: false };
    return guidSchemaCache;
  }

  const [columns] = await db.execute('SHOW COLUMNS FROM `guid`');
  const byName = columns.reduce((acc, col) => {
    acc[col.Field] = col;
    return acc;
  }, {});

  guidSchemaCache = {
    hasTable: true,
    hasGuidName: Boolean(byName.guid_name),
    hasNic: Boolean(byName.nic),
    hasContactDetails: Boolean(byName.contact_details),
  };

  return guidSchemaCache;
};

const encodeDescriptionWithTypeMeta = (description, typeLabel) => {
  const safeDescription = description || '';
  const typeEnum = toPackageTypeEnum(typeLabel);
  if (!typeEnum) return safeDescription;
  return `${PACKAGE_TYPE_META_PREFIX}${typeEnum}]]\n${safeDescription}`;
};

const decodeDescriptionWithTypeMeta = (description) => {
  const text = description || '';
  if (!text.startsWith(PACKAGE_TYPE_META_PREFIX)) {
    return { type: null, description: text };
  }

  const endIndex = text.indexOf(']]');
  if (endIndex === -1) {
    return { type: null, description: text };
  }

  const typeEnum = text.slice(PACKAGE_TYPE_META_PREFIX.length, endIndex);
  const remainder = text.slice(endIndex + 2).replace(/^\n/, '');
  return {
    type: toPackageTypeLabel(typeEnum),
    description: remainder,
  };
};

const toPackageDaysLabel = (value) => {
  if (value == null) return null;
  const normalized = String(value).trim().toUpperCase();
  if (normalized.endsWith('DAYS')) return normalized;
  const number = Number(value);
  if (Number.isNaN(number) || number <= 0) return null;
  return `${number} DAYS`;
};

const toPackageDaysNumber = (value) => {
  if (value == null) return null;
  const match = String(value).match(/(\d+)/);
  return match ? Number(match[1]) : Number(value) || null;
};

const toBoolean = (value) => {
  if (value == null) return false;
  const normalized = String(value).trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'on' || normalized === 'yes';
};

const normalizeGuidInput = (body = {}) => ({
  withGuid: toBoolean(body.withGuid),
  guideName: String(body.guideName || '').trim(),
  guideNic: String(body.guideNic || '').trim(),
  guideContactDetails: String(body.guideContactDetails || '').trim(),
});

const guidRowToPayload = (row) => {
  if (!row || !row.guid_id) return null;
  return {
    id: row.guid_id,
    name: row.guid_name,
    nic: row.nic,
    contactDetails: row.contact_details,
  };
};

const upsertPackageGuid = async (conn, packageId, existingGuidId, guidInput) => {
  const packageMeta = await getPackageSchemaMeta();
  const guidMeta = await getGuidSchemaMeta();
  if (!packageMeta.hasGuidId || !guidMeta.hasTable) return existingGuidId || null;

  if (!guidInput.withGuid) {
    if (existingGuidId) {
      await conn.execute('DELETE FROM `guid` WHERE guid_id = ?', [existingGuidId]);
      if (packageId != null) {
        await conn.execute('UPDATE package SET guid_id = NULL WHERE package_id = ?', [packageId]);
      }
    }
    return null;
  }

  if (!guidInput.guideName || !guidInput.guideNic || !guidInput.guideContactDetails) {
    throw new Error('Guide name, NIC and contact details are required when With Guide is checked.');
  }

  if (existingGuidId) {
    await conn.execute(
      'UPDATE `guid` SET guid_name = ?, nic = ?, contact_details = ? WHERE guid_id = ?',
      [guidInput.guideName, guidInput.guideNic, guidInput.guideContactDetails, existingGuidId]
    );
    return existingGuidId;
  }

  const [guidResult] = await conn.execute(
    'INSERT INTO `guid` (guid_name, nic, contact_details) VALUES (?, ?, ?)',
    [guidInput.guideName, guidInput.guideNic, guidInput.guideContactDetails]
  );
  const guidId = guidResult.insertId;
  if (packageId != null) {
    await conn.execute('UPDATE package SET guid_id = ? WHERE package_id = ?', [guidId, packageId]);
  }
  return guidId;
};

const uploadBufferToCloudinary = (file, folder) => new Promise((resolve) => {
  if (!file) {
    console.debug(`[Cloudinary] No file provided for folder: ${folder}`);
    return resolve(null);
  }

  const existingUrl = file.path || file.url || file.secure_url || file.location || file.filename || null;
  if (!file.buffer) {
    console.debug(`[Cloudinary] File has no buffer, using existing URL: ${existingUrl}`);
    return resolve(existingUrl);
  }

  const hasCloudinaryConfig = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
  if (!hasCloudinaryConfig) {
    console.warn(`[Cloudinary] Config missing (CLOUD_NAME, API_KEY, API_SECRET). Skipping upload for ${folder}.`);
    return resolve(null);
  }

  console.debug(`[Cloudinary] Starting upload to folder: ${folder}, file size: ${file.buffer.length} bytes, originalname: ${file.originalname}`);

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
    },
    (error, result) => {
      if (error) {
        console.error(`[Cloudinary] Upload failed for ${folder}:`, error.message || error);
        return resolve(null);
      }
      const url = result?.secure_url || result?.url || result?.path || null;
      console.debug(`[Cloudinary] Upload successful for ${folder}: ${url}`);
      resolve(url);
    }
  );

  uploadStream.on('error', (err) => {
    console.error(`[Cloudinary] Stream error for ${folder}:`, err.message || err);
    resolve(null);
  });

  uploadStream.end(file.buffer);
});

exports.createPackage = async (req, res) => {
  /*
    Expects multipart/form-data with fields:
      - title, type, days, description
      - destinations: JSON stringified array of { name, description, dayNumber, activities: [{name,phone,description}] }
    Files:
      - packageImage (single)
      - destImages (array) matching destinations order
  */
  try {
    const { title, type, days, description } = req.body;
    const guidInput = normalizeGuidInput(req.body);
    if (!title || !type || !days) {
      return res.status(400).json({ error: 'title, type and days are required.' });
    }

    const packageType = toPackageTypeEnum(type);
    if (!packageType) {
      return res.status(400).json({ error: 'type must be a valid package type.' });
    }

    const schemaMeta = await getPackageSchemaMeta();

    const packageDaysLabel = toPackageDaysLabel(days);
    if (!packageDaysLabel) {
      return res.status(400).json({ error: 'days must be a valid duration value.' });
    }

    // determine DB insert value and coerce to appropriate type
    let packageDaysValue = schemaMeta.daysType.includes('enum')
      ? packageDaysLabel
      : toPackageDaysNumber(packageDaysLabel);

    // defensive coercion: ensure numeric DB column receives a Number
    if (!schemaMeta.daysType.includes('enum')) {
      if (packageDaysValue == null || Number.isNaN(Number(packageDaysValue))) {
        return res.status(400).json({ error: 'days could not be converted to a number for DB insertion.' });
      }
      packageDaysValue = Number(packageDaysValue);
    }

    // debug log to help diagnose truncation errors
    console.debug('createPackage days input ->', { raw: days, label: packageDaysLabel, value: packageDaysValue, daysType: schemaMeta.daysType });

    let destinations = [];
    try {
      destinations = req.body.destinations ? JSON.parse(req.body.destinations) : [];
      if (!Array.isArray(destinations)) destinations = [];
    } catch (e) {
      return res.status(400).json({ error: 'destinations must be a JSON array.' });
    }

    const packageImageFile = req.files && req.files.packageImage && req.files.packageImage[0];
    const packageImage = await uploadBufferToCloudinary(packageImageFile, 'package_uploads');
    const destFiles = req.files && req.files.destImages ? req.files.destImages : [];

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const insertColumns = ['title'];
      const insertValues = [title];

      if (schemaMeta.hasType) {
        insertColumns.push('type');
        insertValues.push(packageType);
      }
      if (schemaMeta.hasDays) {
        insertColumns.push('days');
        insertValues.push(packageDaysValue);
      }
      const storedDescription = schemaMeta.hasType
        ? (description || null)
        : encodeDescriptionWithTypeMeta(description || '', type);

      if (schemaMeta.hasDescription) {
        insertColumns.push('description');
        insertValues.push(storedDescription || null);
      }
      if (schemaMeta.hasImageUrl) {
        insertColumns.push('image_url');
        insertValues.push(packageImage);
      }

      const insertPkgSql = `INSERT INTO package (${insertColumns.join(', ')}) VALUES (${insertColumns.map(() => '?').join(', ')})`;
      console.debug('INSERT statement:', insertPkgSql);
      console.debug('INSERT values:', insertValues);
      const [pkgResult] = await conn.execute(insertPkgSql, insertValues);
      const packageId = pkgResult.insertId;
      const guidId = await upsertPackageGuid(conn, packageId, null, guidInput);

      for (let i = 0; i < destinations.length; i++) {
        const dest = destinations[i] || {};
        const destImage = await uploadBufferToCloudinary(destFiles[i], 'package_uploads') || dest.image || null;

        const placeSql = `INSERT INTO place (place_name, image_url, description) VALUES (?, ?, ?)`;
        const [placeRes] = await conn.execute(placeSql, [dest.name || null, destImage, dest.description || null]);
        const placeId = placeRes.insertId;

        const dayNumber = dest.dayNumber || (i + 1);
        await conn.execute(`INSERT INTO package_place (package_id, place_id, day_number) VALUES (?, ?, ?)`, [packageId, placeId, dayNumber]);

        // activities array for this destination
        const activities = Array.isArray(dest.activities) ? dest.activities : [];
        for (const act of activities) {
          if (!act.name) continue;
          const [actRes] = await conn.execute(`INSERT INTO activity (activity_name, phone, description) VALUES (?, ?, ?)`, [act.name, act.phone || null, act.description || null]);
          const activityId = actRes.insertId;
          await conn.execute(`INSERT INTO place_activity (place_id, activity_id) VALUES (?, ?)`, [placeId, activityId]);
        }
      }

      await conn.commit();

      res.status(201).json({
        package_id: packageId,
        title,
        type: schemaMeta.hasType ? toPackageTypeLabel(packageType) : type,
        days: toPackageDaysNumber(packageDaysLabel),
        description: description || null,
        image_url: packageImage,
        guid: guidId ? {
          id: guidId,
          name: guidInput.guideName,
          nic: guidInput.guideNic,
          contactDetails: guidInput.guideContactDetails,
        } : null,
      });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('createPackage failed:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.listAdminPackages = async (req, res) => {
  try {
    const schemaMeta = await getPackageSchemaMeta();
    const guidMeta = await getGuidSchemaMeta();
    const canJoinGuid = schemaMeta.hasGuidId && guidMeta.hasTable;
    const guidSelect = canJoinGuid
      ? ', p.guid_id, g.guid_name, g.nic, g.contact_details'
      : ', NULL AS guid_id, NULL AS guid_name, NULL AS nic, NULL AS contact_details';
    const guidJoin = canJoinGuid ? 'LEFT JOIN `guid` g ON g.guid_id = p.guid_id' : '';
    const [packages] = await db.execute(`
      SELECT
        p.package_id,
        p.title,
        ${schemaMeta.hasType ? 'p.type' : 'NULL AS type'},
        ${schemaMeta.hasDays ? 'p.days' : 'NULL AS days'},
        ${schemaMeta.hasDescription ? 'p.description' : 'NULL AS description'},
        ${schemaMeta.hasImageUrl ? 'p.image_url' : 'NULL AS image_url'}
        ${guidSelect}
      FROM package p
      ${guidJoin}
      ORDER BY p.package_id DESC
    `);

    const packageIds = packages.map(p => p.package_id);
    let destinationsByPackage = {};

    if (packageIds.length > 0) {
      const [places] = await db.execute(`
        SELECT pp.package_id, pl.place_id, pl.place_name, pl.image_url, pl.description, pp.day_number
        FROM package_place pp
        INNER JOIN place pl ON pl.place_id = pp.place_id
        WHERE pp.package_id IN (${packageIds.join(',')})
        ORDER BY pp.package_id, pp.day_number ASC, pp.id ASC
      `);

      destinationsByPackage = places.reduce((acc, item) => {
        if (!acc[item.package_id]) acc[item.package_id] = [];
        acc[item.package_id].push({
          id: item.place_id,
          name: item.place_name,
          description: item.description,
          image: item.image_url,
          days: item.day_number,
        });
        return acc;
      }, {});
      // also compute counts for hidden destination preview counts
      var placeCountByPkgAdmin = places.reduce((acc, p) => {
        acc[p.package_id] = (acc[p.package_id] || 0) + 1;
        return acc;
      }, {});
    }

    res.json(packages.map(r => {
      const decoded = schemaMeta.hasType
        ? { type: toPackageTypeLabel(r.type), description: r.description }
        : decodeDescriptionWithTypeMeta(r.description);

      const total = (placeCountByPkgAdmin && placeCountByPkgAdmin[r.package_id]) || 0;
      const shown = (destinationsByPackage[r.package_id] || []).length;
      const hidden = Math.max(0, total - Math.min(2, shown));

      return ({
      id: r.package_id,
      title: r.title,
      type: decoded.type,
      days: toPackageDaysNumber(r.days),
      description: decoded.description,
      image_url: r.image_url,
      guid: guidRowToPayload(r),
      destinations: destinationsByPackage[r.package_id] || [],
      places_count: (destinationsByPackage[r.package_id] || []).length,
      hidden_dest_count: hidden,
      });
    }));
  } catch (error) {
    console.error('listAdminPackages failed:', error);
    res.status(500).json({ error: 'Failed to load packages.' });
  }
};

exports.listPublicPackages = async (req, res) => {
  try {
    const schemaMeta = await getPackageSchemaMeta();
    const guidMeta = await getGuidSchemaMeta();
    const canJoinGuid = schemaMeta.hasGuidId && guidMeta.hasTable;
    const guidSelect = canJoinGuid
      ? ', p.guid_id, g.guid_name, g.nic, g.contact_details'
      : ', NULL AS guid_id, NULL AS guid_name, NULL AS nic, NULL AS contact_details';
    const guidJoin = canJoinGuid ? 'LEFT JOIN `guid` g ON g.guid_id = p.guid_id' : '';
    const qType = req.query.type || null;
    const qDays = req.query.days || null;

    const where = [];
    const params = [];

    if (qType) {
      const typeEnum = toPackageTypeEnum(qType);
      if (typeEnum && schemaMeta.hasType) {
        where.push('p.type = ?');
        params.push(typeEnum);
      }
    }

    if (qDays) {
      const daysLabel = toPackageDaysLabel(qDays);
      if (daysLabel && schemaMeta.hasDays) {
        if (schemaMeta.daysType.includes('enum')) {
          where.push('p.days = ?');
          params.push(daysLabel);
        } else {
          const daysNum = toPackageDaysNumber(daysLabel);
          if (!Number.isNaN(daysNum)) {
            where.push('p.days = ?');
            params.push(daysNum);
          }
        }
      }
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [packages] = await db.execute(`
      SELECT
        p.package_id,
        p.title,
        ${schemaMeta.hasType ? 'p.type' : 'NULL AS type'},
        ${schemaMeta.hasDays ? 'p.days' : 'NULL AS days'},
        ${schemaMeta.hasDescription ? 'p.description' : 'NULL AS description'},
        ${schemaMeta.hasImageUrl ? 'p.image_url' : 'NULL AS image_url'}
        ${guidSelect}
      FROM package p
      ${guidJoin}
      ${whereSql}
      ORDER BY p.package_id DESC
    `, params);
    // For performance, load up to first 2 destinations per package and include hidden count
    const pkgIds = packages.map(p => p.package_id);
    let placesByPkg = {};
    let placeCountByPkg = {};
    if (pkgIds.length > 0) {
      const [places] = await db.execute(
        `SELECT pp.package_id, pl.place_name, pl.image_url, pp.day_number
         FROM package_place pp
         INNER JOIN place pl ON pl.place_id = pp.place_id
         WHERE pp.package_id IN (${pkgIds.join(',')})
         ORDER BY pp.package_id, pp.day_number ASC`
      );
      placeCountByPkg = places.reduce((acc, p) => {
        acc[p.package_id] = (acc[p.package_id] || 0) + 1;
        return acc;
      }, {});
      placesByPkg = places.reduce((acc, p) => {
        acc[p.package_id] = acc[p.package_id] || [];
        if (acc[p.package_id].length < 2) acc[p.package_id].push({ name: p.place_name, image: p.image_url, dayNumber: p.day_number });
        return acc;
      }, {});
    }

    // If schema doesn't have a dedicated type column but the client requested a type filter,
    // perform a secondary filter by decoding the description metadata.
    let filteredPackages = packages;
    if (qType && !schemaMeta.hasType) {
      filteredPackages = packages.filter(p => {
        const decoded = decodeDescriptionWithTypeMeta(p.description);
        return decoded.type && decoded.type.toUpperCase() === String(qType).trim().toUpperCase();
      });
    }

    const result = filteredPackages.map(p => {
      const decoded = schemaMeta.hasType
        ? { type: toPackageTypeLabel(p.type), description: p.description }
        : decodeDescriptionWithTypeMeta(p.description);

      const shown = (placesByPkg[p.package_id] || []).length;
      const total = placeCountByPkg[p.package_id] || 0;
      const hidden = Math.max(0, total - shown);

      return ({
      id: p.package_id,
      title: p.title,
      type: decoded.type,
      days: toPackageDaysNumber(p.days),
      description: decoded.description,
      image: p.image_url,
      guid: guidRowToPayload(p),
      highlights: [],
      destinations: placesByPkg[p.package_id] || [],
      hidden_dest_count: hidden,
      });
    });
    res.json(result);
  } catch (error) {
    console.error('listPublicPackages failed:', error);
    res.status(500).json({ error: 'Failed to load packages.' });
  }
};

exports.getPackageDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const schemaMeta = await getPackageSchemaMeta();
    const guidMeta = await getGuidSchemaMeta();
    const canJoinGuid = schemaMeta.hasGuidId && guidMeta.hasTable;
    const guidSelect = canJoinGuid
      ? ', p.guid_id, g.guid_name, g.nic, g.contact_details'
      : ', NULL AS guid_id, NULL AS guid_name, NULL AS nic, NULL AS contact_details';
    const guidJoin = canJoinGuid ? 'LEFT JOIN `guid` g ON g.guid_id = p.guid_id' : '';
    const [[pkgRow]] = await db.execute(`
      SELECT
        p.package_id,
        p.title,
        ${schemaMeta.hasType ? 'p.type' : 'NULL AS type'},
        ${schemaMeta.hasDays ? 'p.days' : 'NULL AS days'},
        ${schemaMeta.hasDescription ? 'p.description' : 'NULL AS description'},
        ${schemaMeta.hasImageUrl ? 'p.image_url' : 'NULL AS image_url'}
        ${guidSelect}
      FROM package p
      ${guidJoin}
      WHERE p.package_id = ?
    `, [id]);
    if (!pkgRow) return res.status(404).json({ error: 'Package not found.' });

    const [places] = await db.execute(
      `SELECT pl.place_id, pl.place_name, pl.image_url, pl.description, pp.day_number
       FROM package_place pp
       INNER JOIN place pl ON pl.place_id = pp.place_id
       WHERE pp.package_id = ?
       ORDER BY pp.day_number ASC`,
      [id]
    );

    // load activities per place
    const [activities] = await db.execute(
      `SELECT pa.place_id, a.activity_id, a.activity_name, a.phone, a.description
       FROM place_activity pa
       INNER JOIN activity a ON a.activity_id = pa.activity_id
       WHERE pa.place_id IN (${places.map(p=>p.place_id).join(',') || '0'})`
    );

    const activitiesByPlace = activities.reduce((acc, a) => {
      if (!acc[a.place_id]) acc[a.place_id] = [];
      acc[a.place_id].push({ id: a.activity_id, name: a.activity_name, phone: a.phone, description: a.description });
      return acc;
    }, {});

    const detailedPlaces = places.map(p => ({
      id: p.place_id,
      name: p.place_name,
      image: p.image_url,
      description: p.description,
      dayNumber: p.day_number,
      activities: activitiesByPlace[p.place_id] || []
    }));

    const decoded = schemaMeta.hasType
      ? { type: toPackageTypeLabel(pkgRow.type), description: pkgRow.description }
      : decodeDescriptionWithTypeMeta(pkgRow.description);

    res.json({
      id: pkgRow.package_id,
      title: pkgRow.title,
      type: decoded.type,
      days: toPackageDaysNumber(pkgRow.days),
      description: decoded.description,
      image: pkgRow.image_url,
      destinations: detailedPlaces,
      guid: guidRowToPayload(pkgRow),
    });
  } catch (error) {
    console.error('getPackageDetail failed:', error);
    res.status(500).json({ error: 'Failed to load package.' });
  }
};

// GET /api/packages/:id/recommendations
exports.getRecommendations = async (req, res) => {
  const { id } = req.params;
  const limit = Number(req.query.limit) || 6;
  try {
    const schemaMeta = await getPackageSchemaMeta();
    // load base package
    const [[pkgRow]] = await db.execute(`SELECT package_id, title, ${schemaMeta.hasType ? 'type' : 'NULL AS type'}, ${schemaMeta.hasDays ? 'days' : 'NULL AS days'} FROM package WHERE package_id = ?`, [id]);
    if (!pkgRow) return res.status(404).json({ error: 'Package not found.' });

    const pkgType = schemaMeta.hasType ? pkgRow.type : null;
    const pkgDays = schemaMeta.hasDays ? pkgRow.days : null;

    // Helper queries
    const similarByType = pkgType ? await db.execute(
      `SELECT package_id AS id, title, ${schemaMeta.hasType ? 'type' : 'NULL AS type'}, ${schemaMeta.hasDays ? 'days' : 'NULL AS days'}, image_url AS image FROM package WHERE package_id != ? AND type = ? ORDER BY package_id DESC LIMIT ${Number(limit)}`,
      [id, pkgType]
    ) : [[],];

    const similarByDays = pkgDays ? await db.execute(
      `SELECT package_id AS id, title, ${schemaMeta.hasType ? 'type' : 'NULL AS type'}, ${schemaMeta.hasDays ? 'days' : 'NULL AS days'}, image_url AS image FROM package WHERE package_id != ? AND days = ? ORDER BY package_id DESC LIMIT ${Number(limit)}`,
      [id, pkgDays]
    ) : [[],];

    // Top rated packages (average rating via reviews -> booking_package)
    const [topRated] = await db.execute(
      `SELECT bp.package_id AS id, p.title, p.image_url AS image, AVG(r.rating) AS avg_rating, COUNT(r.review_id) AS reviews_count
       FROM review r
       INNER JOIN booking_package bp ON bp.booking_id = r.booking_id
       INNER JOIN package p ON p.package_id = bp.package_id
       WHERE bp.package_id != ?
       GROUP BY bp.package_id
       ORDER BY avg_rating DESC, reviews_count DESC
       LIMIT ${Number(limit)}`,
      [id]
    );

    // Most booked packages
    const [mostBooked] = await db.execute(
      `SELECT bp.package_id AS id, p.title, p.image_url AS image, COUNT(bp.booking_id) AS bookings_count
       FROM booking_package bp
       INNER JOIN package p ON p.package_id = bp.package_id
       WHERE bp.package_id != ?
       GROUP BY bp.package_id
       ORDER BY bookings_count DESC
       LIMIT ${Number(limit)}`,
      [id]
    );

    // Normalize results
    const normalize = (rows) => (Array.isArray(rows) ? rows.map(r => ({ id: r.id, title: r.title, type: r.type || null, days: r.days || null, image: r.image || r.image_url || null, avg_rating: r.avg_rating != null ? Number(r.avg_rating) : undefined, reviews_count: r.reviews_count != null ? Number(r.reviews_count) : undefined, bookings_count: r.bookings_count != null ? Number(r.bookings_count) : undefined })) : []);

    res.json({
      similarByType: normalize(similarByType[0] || similarByType),
      similarByDays: normalize(similarByDays[0] || similarByDays),
      topRated: normalize(topRated[0] || topRated),
      mostBooked: normalize(mostBooked[0] || mostBooked),
    });
  } catch (error) {
    console.error('getRecommendations failed:', error);
    res.status(500).json({ error: 'Failed to compute recommendations.' });
  }
};

exports.updatePackage = async (req, res) => {
  const { id } = req.params;
  try {
    const schemaMeta = await getPackageSchemaMeta();
    const guidMeta = await getGuidSchemaMeta();

    const { title, type, days, description } = req.body;
    const guidInput = normalizeGuidInput(req.body);
    const packageType = type ? toPackageTypeEnum(type) : null;

    const packageImageFile = req.files && req.files.packageImage && req.files.packageImage[0];
    const packageImage = await uploadBufferToCloudinary(packageImageFile, 'package_uploads');
    const destFiles = req.files && req.files.destImages ? req.files.destImages : [];

    let destinations = [];
    try {
      destinations = req.body.destinations ? JSON.parse(req.body.destinations) : [];
      if (!Array.isArray(destinations)) destinations = [];
    } catch (e) {
      return res.status(400).json({ error: 'destinations must be a JSON array.' });
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // ensure package exists
      const [[existing]] = await conn.execute(
        schemaMeta.hasGuidId
          ? 'SELECT package_id, image_url, guid_id FROM package WHERE package_id = ?'
          : 'SELECT package_id, image_url FROM package WHERE package_id = ?',
        [id]
      );
      if (!existing) {
        await conn.rollback();
        return res.status(404).json({ error: 'Package not found.' });
      }

      const updateCols = [];
      const updateVals = [];
      if (title != null) { updateCols.push('title = ?'); updateVals.push(title); }
      if (schemaMeta.hasType && packageType) { updateCols.push('type = ?'); updateVals.push(packageType); }
      if (schemaMeta.hasDays && days != null) {
        const daysLabel = toPackageDaysLabel(days);
        const daysVal = schemaMeta.daysType.includes('enum') ? daysLabel : toPackageDaysNumber(daysLabel);
        updateCols.push('days = ?'); updateVals.push(daysVal);
      }

      const storedDescription = schemaMeta.hasType
        ? (description || null)
        : (description != null ? encodeDescriptionWithTypeMeta(description || '', type) : null);
      if (schemaMeta.hasDescription && description != null) { updateCols.push('description = ?'); updateVals.push(storedDescription); }

      // image handling: if a new image was uploaded, use it; otherwise keep existing
      if (schemaMeta.hasImageUrl && packageImage) {
        updateCols.push('image_url = ?'); updateVals.push(packageImage);
      }

      if (schemaMeta.hasGuidId && guidMeta.hasTable) {
        if (!guidInput.withGuid && existing.guid_id) {
          await conn.execute('DELETE FROM `guid` WHERE guid_id = ?', [existing.guid_id]);
          updateCols.push('guid_id = ?');
          updateVals.push(null);
        } else if (guidInput.withGuid) {
          if (!guidInput.guideName || !guidInput.guideNic || !guidInput.guideContactDetails) {
            await conn.rollback();
            return res.status(400).json({ error: 'Guide name, NIC and contact details are required when With Guide is checked.' });
          }

          if (existing.guid_id) {
            await conn.execute(
              'UPDATE `guid` SET guid_name = ?, nic = ?, contact_details = ? WHERE guid_id = ?',
              [guidInput.guideName, guidInput.guideNic, guidInput.guideContactDetails, existing.guid_id]
            );
          } else {
            const [guidResult] = await conn.execute(
              'INSERT INTO `guid` (guid_name, nic, contact_details) VALUES (?, ?, ?)',
              [guidInput.guideName, guidInput.guideNic, guidInput.guideContactDetails]
            );
            updateCols.push('guid_id = ?');
            updateVals.push(guidResult.insertId);
          }
        }
      }

      if (updateCols.length > 0) {
        const sql = `UPDATE package SET ${updateCols.join(', ')} WHERE package_id = ?`;
        await conn.execute(sql, [...updateVals, id]);
      }

      // Remove existing places/activities for this package before recreating
      const [places] = await conn.execute(`SELECT pp.place_id FROM package_place pp WHERE pp.package_id = ?`, [id]);
      const placeIds = places.map(p => p.place_id);
      if (placeIds.length > 0) {
        const idsList = placeIds.join(',');
        // find activity ids
        const [paRows] = await conn.execute(`SELECT activity_id FROM place_activity WHERE place_id IN (${idsList})`);
        const activityIds = paRows.map(r => r.activity_id);
        if (activityIds.length > 0) {
          await conn.execute(`DELETE FROM place_activity WHERE place_id IN (${idsList})`);
          await conn.execute(`DELETE FROM activity WHERE activity_id IN (${activityIds.join(',')})`);
        }
        await conn.execute(`DELETE FROM package_place WHERE package_id = ?`, [id]);
        await conn.execute(`DELETE FROM place WHERE place_id IN (${idsList})`);
      }

      // recreate destinations and activities
      for (let i = 0; i < destinations.length; i++) {
        const dest = destinations[i] || {};
        const destImage = await uploadBufferToCloudinary(destFiles[i], 'package_uploads') || dest.image || null;

        const placeSql = `INSERT INTO place (place_name, image_url, description) VALUES (?, ?, ?)`;
        const [placeRes] = await conn.execute(placeSql, [dest.name || null, destImage, dest.description || null]);
        const placeId = placeRes.insertId;

        const dayNumber = dest.dayNumber || (i + 1);
        await conn.execute(`INSERT INTO package_place (package_id, place_id, day_number) VALUES (?, ?, ?)`, [id, placeId, dayNumber]);

        const activities = Array.isArray(dest.activities) ? dest.activities : [];
        for (const act of activities) {
          if (!act.name) continue;
          const [actRes] = await conn.execute(`INSERT INTO activity (activity_name, phone, description) VALUES (?, ?, ?)`, [act.name, act.phone || null, act.description || null]);
          const activityId = actRes.insertId;
          await conn.execute(`INSERT INTO place_activity (place_id, activity_id) VALUES (?, ?)`, [placeId, activityId]);
        }
      }

      await conn.commit();

      res.json({ success: true, package_id: Number(id) });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('updatePackage failed:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deletePackage = async (req, res) => {
  const { id } = req.params;
  try {
    const packageMeta = await getPackageSchemaMeta();
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const deleteLookupSql = packageMeta.hasGuidId
        ? 'SELECT package_id, guid_id FROM package WHERE package_id = ?'
        : 'SELECT package_id FROM package WHERE package_id = ?';
      const [[existing]] = await conn.execute(deleteLookupSql, [id]);
      if (!existing) {
        await conn.rollback();
        return res.status(404).json({ error: 'Package not found.' });
      }

      const [places] = await conn.execute(`SELECT pp.place_id FROM package_place pp WHERE pp.package_id = ?`, [id]);
      const placeIds = places.map(p => p.place_id);
      if (placeIds.length > 0) {
        const idsList = placeIds.join(',');
        const [paRows] = await conn.execute(`SELECT activity_id FROM place_activity WHERE place_id IN (${idsList})`);
        const activityIds = paRows.map(r => r.activity_id);
        if (activityIds.length > 0) {
          await conn.execute(`DELETE FROM place_activity WHERE place_id IN (${idsList})`);
          await conn.execute(`DELETE FROM activity WHERE activity_id IN (${activityIds.join(',')})`);
        }
        await conn.execute(`DELETE FROM package_place WHERE package_id = ?`, [id]);
        await conn.execute(`DELETE FROM place WHERE place_id IN (${idsList})`);
      }

      await conn.execute(`DELETE FROM package WHERE package_id = ?`, [id]);

      if (existing.guid_id) {
        await conn.execute('DELETE FROM `guid` WHERE guid_id = ?', [existing.guid_id]);
      }

      await conn.commit();
      res.json({ success: true });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('deletePackage failed:', error);
    res.status(500).json({ error: error.message });
  }
};
