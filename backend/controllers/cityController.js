const db = require('../db/connection');

// GET /api/cities
const getAllCities = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, name FROM city ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ message: 'Failed to fetch cities' });
  }
};

// POST /api/cities
const addCity = async (req, res) => {
  const { name } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'City name is required' });
  }

  try {
    const [result] = await db.execute('INSERT INTO city (name) VALUES (?)', [name.trim()]);
    res.status(201).json({ id: result.insertId, name: name.trim() });
  } catch (error) {
    console.error('Error adding city:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'City already exists' });
    }
    res.status(500).json({ message: 'Failed to add city' });
  }
};

// DELETE /api/cities/:id
const deleteCity = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM city WHERE id = ?', [id]);
    res.json({ message: 'City deleted successfully' });
  } catch (error) {
    console.error('Error deleting city:', error);
    res.status(500).json({ message: 'Failed to delete city' });
  }
};

module.exports = {
  getAllCities,
  addCity,
  deleteCity
};
