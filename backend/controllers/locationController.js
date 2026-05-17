const db = require('../db/connection');

const mapLocationRow = (row) => ({
  id: row.location_id,
  name: row.name,
  region: row.region,
  lat: Number(row.latitude),
  lng: Number(row.longitude),
  desc: row.description || '',
  col: row.pin_color || '#00b0a5',
  photos: Number(row.photos || 0),
  created_at: row.created_at,
});

exports.getLocations = async (_req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT
         gl.*,
         COUNT(g.gallery_id) AS photos
       FROM gallery_location gl
       LEFT JOIN gallery g ON g.location_id = gl.location_id
       GROUP BY gl.location_id
       ORDER BY gl.name ASC`
    );

    res.json(rows.map(mapLocationRow));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addLocation = async (req, res) => {
  try {
    const { name, region, lat, lng, desc, col } = req.body;

    if (!name || !region) {
      return res.status(400).json({ error: 'Name and region are required.' });
    }

    const latitude = Number(lat);
    const longitude = Number(lng);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return res.status(400).json({ error: 'Valid latitude and longitude are required.' });
    }

    const [result] = await db.execute(
      `INSERT INTO gallery_location (name, region, latitude, longitude, description, pin_color)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name.trim(), region.trim(), latitude, longitude, desc || null, col || '#00b0a5']
    );

    const [rows] = await db.execute(
      `SELECT gl.*, 0 AS photos
       FROM gallery_location gl
       WHERE gl.location_id = ?`,
      [result.insertId]
    );

    res.status(201).json(mapLocationRow(rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, region, lat, lng, desc, col } = req.body;

    const [existingRows] = await db.execute('SELECT * FROM gallery_location WHERE location_id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Location not found.' });
    }

    const current = existingRows[0];
    const latitude = typeof lat === 'undefined' ? Number(current.latitude) : Number(lat);
    const longitude = typeof lng === 'undefined' ? Number(current.longitude) : Number(lng);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return res.status(400).json({ error: 'Valid latitude and longitude are required.' });
    }

    await db.execute(
      `UPDATE gallery_location
       SET name = ?, region = ?, latitude = ?, longitude = ?, description = ?, pin_color = ?
       WHERE location_id = ?`,
      [
        (name || current.name).trim(),
        (region || current.region).trim(),
        latitude,
        longitude,
        typeof desc === 'undefined' ? current.description : desc,
        col || current.pin_color,
        id,
      ]
    );

    const [rows] = await db.execute(
      `SELECT gl.*, COUNT(g.gallery_id) AS photos
       FROM gallery_location gl
       LEFT JOIN gallery g ON g.location_id = gl.location_id
       WHERE gl.location_id = ?
       GROUP BY gl.location_id`,
      [id]
    );

    res.json(mapLocationRow(rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingRows] = await db.execute('SELECT location_id FROM gallery_location WHERE location_id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Location not found.' });
    }

    await db.execute('DELETE FROM gallery_location WHERE location_id = ?', [id]);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
