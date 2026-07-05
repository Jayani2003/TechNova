const pool = require('../db/connection');

// GET /api/activities
exports.getAllActivities = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM custom_activity ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error fetching activities' });
  }
};

// POST /api/activities
exports.addActivity = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Activity name is required' });
  }
  try {
    const [result] = await pool.query('INSERT INTO custom_activity (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Activity already exists' });
    }
    console.error('Error adding activity:', error);
    res.status(500).json({ message: 'Server error adding activity' });
  }
};

// DELETE /api/activities/:id
exports.deleteActivity = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM custom_activity WHERE id = ?', [id]);
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: 'Server error deleting activity' });
  }
};
