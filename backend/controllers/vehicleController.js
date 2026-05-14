const db = require('../db/connection');

const DEFAULT_CATEGORIES = [
  { name: 'Mini Car', description: 'Compact cars for city travel.' },
  { name: 'Normal Car', description: 'Standard cars for everyday trips.' },
  { name: 'Sedan Car', description: 'Comfortable sedans for longer rides.' },
  { name: 'MPV', description: 'Multi-purpose vehicles for groups.' },
  { name: 'SUV', description: 'Spacious vehicles for rougher roads.' },
  { name: 'Mini Van', description: 'Practical vans for families.' },
  { name: 'Van', description: 'Large vans for passenger transport.' },
  { name: 'Large Van', description: 'High-capacity vans for bigger groups.' },
];

const STATUS_LABELS = {
  AVAILABLE: 'Available',
  BOOKED: 'Booked',
  MAINTENANCE: 'Maintenance',
  RETIRED: 'Retired', 
};

const normalizeStatus = (status) => {
  const normalized = String(status || 'AVAILABLE').trim().toUpperCase();
  return STATUS_LABELS[normalized] ? normalized : 'AVAILABLE';
};

const toStatusLabel = (status) => STATUS_LABELS[normalizeStatus(status)];

const safeNumber = (value) => {
  if (value == null || value === '') return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const mapCategory = (row) => ({
  id: row.category_id,
  name: row.category_name,
  description: row.description || '',
  image_url: row.image_url || null,
  vehicle_count: Number(row.vehicle_count || 0),
});

const mapVehicle = (row) => ({
  id: row.vehicle_id,
  category_id: row.category_id,
  category_name: row.category_name || '',
  vehicle_name: row.vehicle_name || row.name || '',
  brand: row.brand || '',
  model: row.model || '',
  year: row.manufactured_year || null,
  color: row.color || '',
  license_plate: row.vehicle_number || '',
  seats: row.adult_seats || 0,
  fuel_type: row.fuel_type || '',
  transmission: row.transmission || '',
  air_conditioning: Boolean(row.air_conditioning),
  luggage_capacity: row.luggage_capacity || 0,
  price_per_day: row.price_per_day != null ? Number(row.price_per_day) : null,
  status: toStatusLabel(row.vehicle_status),
  image_url: row.image_url || '',
  mileage: row.mileage || null,
  engine_capacity: row.engine_capacity || '',
  features: row.features || '',
});

const ensureDefaultCategories = async () => {
  const [existingRows] = await db.execute('SELECT category_name FROM vehicle_category');
  const existingNames = new Set(existingRows.map((row) => row.category_name));
  const missing = DEFAULT_CATEGORIES.filter((category) => !existingNames.has(category.name));

  if (missing.length === 0) return;

  for (const category of missing) {
    await db.execute(
      'INSERT INTO vehicle_category (category_name, description) VALUES (?, ?)',
      [category.name, category.description]
    );
  }
};

exports.listCategories = async (_req, res) => {
  try {
    await ensureDefaultCategories();

    const [rows] = await db.execute(`
      SELECT
        vc.category_id,
        vc.category_name,
        vc.description,
        vc.image_url,
        COUNT(v.vehicle_id) AS vehicle_count
      FROM vehicle_category vc
      LEFT JOIN vehicle v ON v.category_id = vc.category_id
      GROUP BY vc.category_id, vc.category_name, vc.description, vc.image_url
      ORDER BY vc.category_id ASC
    `);

    res.json({ success: true, data: rows.map(mapCategory) });
  } catch (error) {
    console.error('listCategories error:', error);
    res.status(500).json({ success: false, message: 'Failed to load categories.' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT
        vc.category_id,
        vc.category_name,
        vc.description,
        vc.image_url,
        COUNT(v.vehicle_id) AS vehicle_count
      FROM vehicle_category vc
      LEFT JOIN vehicle v ON v.category_id = vc.category_id
      WHERE vc.category_id = ?
      GROUP BY vc.category_id, vc.category_name, vc.description, vc.image_url
      LIMIT 1`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.json({ success: true, data: mapCategory(rows[0]) });
  } catch (error) {
    console.error('getCategoryById error:', error);
    res.status(500).json({ success: false, message: 'Failed to load category.' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description = '', image_url = null } = req.body;
    const uploadedImageUrl = req.file?.path || req.file?.url || req.file?.secure_url || req.file?.location || req.file?.filename || null;
    const resolvedImageUrl = uploadedImageUrl || image_url || null;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const [result] = await db.execute(
      'INSERT INTO vehicle_category (category_name, description, image_url) VALUES (?, ?, ?)',
      [name, description || null, resolvedImageUrl]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        name,
        description: description || '',
        image_url: resolvedImageUrl,
        vehicle_count: 0,
      },
    });
  } catch (error) {
    console.error('createCategory error:', error);
    res.status(500).json({ success: false, message: 'Failed to create category.' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description = '', image_url } = req.body;
    const uploadedImageUrl = req.file?.path || req.file?.url || req.file?.secure_url || req.file?.location || req.file?.filename || null;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const [existingRows] = await db.execute(
      'SELECT image_url FROM vehicle_category WHERE category_id = ? LIMIT 1',
      [req.params.id]
    );

    if (!existingRows.length) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const resolvedImageUrl = uploadedImageUrl || image_url || existingRows[0].image_url || null;

    const [result] = await db.execute(
      'UPDATE vehicle_category SET category_name = ?, description = ?, image_url = ? WHERE category_id = ?',
      [name, description || null, resolvedImageUrl, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.json({ success: true, message: 'Category updated successfully.' });
  } catch (error) {
    console.error('updateCategory error:', error);
    res.status(500).json({ success: false, message: 'Failed to update category.' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM vehicle_category WHERE category_id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ success: false, message: 'Category is in use by existing vehicles.' });
    }

    console.error('deleteCategory error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete category.' });
  }
};

exports.listVehicles = async (_req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        v.vehicle_id,
        v.category_id,
        vc.category_name,
        v.vehicle_number,
        v.name AS vehicle_name,
        v.color,
        v.manufactured_year,
        v.adult_seats,
        v.baby_seats,
        v.luggage_capacity,
        v.price_per_day,
        v.image_url,
        v.vehicle_status,
        v.brand,
        v.model,
        v.fuel_type,
        v.transmission,
        v.air_conditioning,
        v.mileage,
        v.engine_capacity,
        v.features
      FROM vehicle v
      LEFT JOIN vehicle_category vc ON vc.category_id = v.category_id
      ORDER BY v.vehicle_id DESC
    `);

    res.json({ success: true, data: rows.map(mapVehicle) });
  } catch (error) {
    console.error('listVehicles error:', error);
    res.status(500).json({ success: false, message: 'Failed to load vehicles.' });
  }
};

exports.listVehiclesByCategory = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT
        v.vehicle_id,
        v.category_id,
        vc.category_name,
        v.vehicle_number,
        v.name AS vehicle_name,
        v.color,
        v.manufactured_year,
        v.adult_seats,
        v.baby_seats,
        v.luggage_capacity,
        v.price_per_day,
        v.image_url,
        v.vehicle_status,
        v.brand,
        v.model,
        v.fuel_type,
        v.transmission,
        v.air_conditioning,
        v.mileage,
        v.engine_capacity,
        v.features
      FROM vehicle v
      LEFT JOIN vehicle_category vc ON vc.category_id = v.category_id
      WHERE v.category_id = ?
      ORDER BY v.vehicle_id DESC`,
      [req.params.categoryId]
    );

    res.json({ success: true, data: rows.map(mapVehicle) });
  } catch (error) {
    console.error('listVehiclesByCategory error:', error);
    res.status(500).json({ success: false, message: 'Failed to load vehicles.' });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT
        v.vehicle_id,
        v.category_id,
        vc.category_name,
        v.vehicle_number,
        v.name AS vehicle_name,
        v.color,
        v.manufactured_year,
        v.adult_seats,
        v.baby_seats,
        v.luggage_capacity,
        v.price_per_day,
        v.image_url,
        v.vehicle_status,
        v.brand,
        v.model,
        v.fuel_type,
        v.transmission,
        v.air_conditioning,
        v.mileage,
        v.engine_capacity,
        v.features
      FROM vehicle v
      LEFT JOIN vehicle_category vc ON vc.category_id = v.category_id
      WHERE v.vehicle_id = ?
      LIMIT 1`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    res.json({ success: true, data: mapVehicle(rows[0]) });
  } catch (error) {
    console.error('getVehicleById error:', error);
    res.status(500).json({ success: false, message: 'Failed to load vehicle.' });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const {
      category_id,
      vehicle_name,
      name,
      license_plate,
      vehicle_number,
      color,
      year,
      manufactured_year,
      seats,
      adult_seats,
      luggage_capacity,
      price_per_day,
      image_url,
      status,
      brand,
      model,
      fuel_type,
      transmission,
      air_conditioning,
      mileage,
      engine_capacity,
      features,
    } = req.body;
    const uploadedImageUrl = req.file?.path || req.file?.url || req.file?.secure_url || req.file?.location || req.file?.filename || null;

    const resolvedCategoryId = safeNumber(category_id);
    if (!resolvedCategoryId) {
      return res.status(400).json({ success: false, message: 'category_id is required.' });
    }

    const vehicleLabel = vehicle_name || name || '';
    const plateNumber = license_plate || vehicle_number || '';

    if (!vehicleLabel || !plateNumber) {
      return res.status(400).json({ success: false, message: 'vehicle_name and license_plate are required.' });
    }

    const [categoryRows] = await db.execute('SELECT category_id FROM vehicle_category WHERE category_id = ? LIMIT 1', [resolvedCategoryId]);
    if (!categoryRows.length) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const [result] = await db.execute(
      `INSERT INTO vehicle (
        category_id,
        vehicle_number,
        name,
        color,
        manufactured_year,
        adult_seats,
        baby_seats,
        luggage_capacity,
        price_per_day,
        image_url,
        vehicle_status,
        brand,
        model,
        fuel_type,
        transmission,
        air_conditioning,
        mileage,
        engine_capacity,
        features
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        resolvedCategoryId,
        plateNumber,
        vehicleLabel,
        color || null,
        safeNumber(year || manufactured_year),
        safeNumber(seats || adult_seats) || 0,
        0,
        safeNumber(luggage_capacity) || 0,
        safeNumber(price_per_day),
        uploadedImageUrl || image_url || null,
        normalizeStatus(status),
        brand || null,
        model || null,
        fuel_type || null,
        transmission || null,
        Boolean(air_conditioning) ? 1 : 0,
        safeNumber(mileage),
        engine_capacity || null,
        features || null,
      ]
    );

    const [createdRows] = await db.execute(
      `SELECT
        v.vehicle_id,
        v.category_id,
        vc.category_name,
        v.vehicle_number,
        v.name AS vehicle_name,
        v.color,
        v.manufactured_year,
        v.adult_seats,
        v.baby_seats,
        v.luggage_capacity,
        v.price_per_day,
        v.image_url,
        v.vehicle_status,
        v.brand,
        v.model,
        v.fuel_type,
        v.transmission,
        v.air_conditioning,
        v.mileage,
        v.engine_capacity,
        v.features
      FROM vehicle v
      LEFT JOIN vehicle_category vc ON vc.category_id = v.category_id
      WHERE v.vehicle_id = ?
      LIMIT 1`,
      [result.insertId]
    );

    res.status(201).json({ success: true, data: mapVehicle(createdRows[0]) });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Vehicle number already exists.' });
    }

    console.error('createVehicle error:', error);
    res.status(500).json({ success: false, message: 'Failed to create vehicle.' });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const {
      category_id,
      vehicle_name,
      name,
      license_plate,
      vehicle_number,
      color,
      year,
      manufactured_year,
      seats,
      adult_seats,
      luggage_capacity,
      price_per_day,
      image_url,
      status,
      brand,
      model,
      fuel_type,
      transmission,
      air_conditioning,
      mileage,
      engine_capacity,
      features,
    } = req.body;
    const uploadedImageUrl = req.file?.path || req.file?.url || req.file?.secure_url || req.file?.location || req.file?.filename || null;

    const resolvedCategoryId = safeNumber(category_id);
    const vehicleLabel = vehicle_name || name || '';
    const plateNumber = license_plate || vehicle_number || '';

    const [existingRows] = await db.execute(
      'SELECT image_url FROM vehicle WHERE vehicle_id = ? LIMIT 1',
      [req.params.id]
    );

    if (!existingRows.length) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    const resolvedImageUrl = uploadedImageUrl || image_url || existingRows[0].image_url || null;

    const [result] = await db.execute(
      `UPDATE vehicle SET
        category_id = COALESCE(?, category_id),
        vehicle_number = COALESCE(NULLIF(?, ''), vehicle_number),
        name = COALESCE(NULLIF(?, ''), name),
        color = ?,
        manufactured_year = ?,
        adult_seats = ?,
        luggage_capacity = ?,
        price_per_day = ?,
        image_url = ?,
        vehicle_status = ?,
        brand = ?,
        model = ?,
        fuel_type = ?,
        transmission = ?,
        air_conditioning = ?,
        mileage = ?,
        engine_capacity = ?,
        features = ?
      WHERE vehicle_id = ?`,
      [
        resolvedCategoryId,
        plateNumber,
        vehicleLabel,
        color || null,
        safeNumber(year || manufactured_year),
        safeNumber(seats || adult_seats),
        safeNumber(luggage_capacity),
        safeNumber(price_per_day),
        resolvedImageUrl,
        normalizeStatus(status),
        brand || null,
        model || null,
        fuel_type || null,
        transmission || null,
        Boolean(air_conditioning) ? 1 : 0,
        safeNumber(mileage),
        engine_capacity || null,
        features || null,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    const [updatedRows] = await db.execute(
      `SELECT
        v.vehicle_id,
        v.category_id,
        vc.category_name,
        v.vehicle_number,
        v.name AS vehicle_name,
        v.color,
        v.manufactured_year,
        v.adult_seats,
        v.baby_seats,
        v.luggage_capacity,
        v.price_per_day,
        v.image_url,
        v.vehicle_status,
        v.brand,
        v.model,
        v.fuel_type,
        v.transmission,
        v.air_conditioning,
        v.mileage,
        v.engine_capacity,
        v.features
      FROM vehicle v
      LEFT JOIN vehicle_category vc ON vc.category_id = v.category_id
      WHERE v.vehicle_id = ?
      LIMIT 1`,
      [req.params.id]
    );

    res.json({ success: true, data: mapVehicle(updatedRows[0]) });
  } catch (error) {
    console.error('updateVehicle error:', error);
    res.status(500).json({ success: false, message: 'Failed to update vehicle.' });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM vehicle WHERE vehicle_id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    res.json({ success: true, message: 'Vehicle deleted successfully.' });
  } catch (error) {
    console.error('deleteVehicle error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete vehicle.' });
  }
};

exports.getStats = async (_req, res) => {
  try {
    const [[vehicleStats]] = await db.execute(`
      SELECT
        COUNT(*) AS total,
        COALESCE(SUM(vehicle_status = 'AVAILABLE'), 0) AS available,
        COALESCE(SUM(vehicle_status = 'BOOKED'), 0) AS booked,
        COALESCE(SUM(vehicle_status = 'MAINTENANCE'), 0) AS maintenance
      FROM vehicle
    `);

    res.json({
      success: true,
      data: {
        total: Number(vehicleStats.total || 0),
        available: Number(vehicleStats.available || 0),
        booked: Number(vehicleStats.booked || 0),
        maintenance: Number(vehicleStats.maintenance || 0),
      },
    });
  } catch (error) {
    console.error('getStats error:', error);
    res.status(500).json({ success: false, message: 'Failed to load vehicle statistics.' });
  }
};