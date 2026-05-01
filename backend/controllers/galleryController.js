const db = require('../db/connection');

const mapGalleryRow = (row) => ({
	id: row.gallery_id,
	title: row.title,
	category: row.category,
	url: row.image_url,
	image_url: row.image_url,
	description: row.description,
	created_at: row.created_at,
});

exports.addGalleryItem = async (req, res) => {
    try {
        const { title, category, description } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required.' });
        }

        const image_url = req.file.path;

        const sql = "INSERT INTO gallery (title, category, image_url, description) VALUES (?, ?, ?, ?)";
        const [result] = await db.execute(sql, [title, category, image_url, description]);

        const [rows] = await db.execute('SELECT * FROM gallery WHERE gallery_id = ?', [result.insertId]);

        res.status(201).json(mapGalleryRow(rows[0]));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getGallery = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM gallery ORDER BY created_at DESC");
        res.json(rows.map(mapGalleryRow));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, description } = req.body;

        const [existingRows] = await db.execute('SELECT * FROM gallery WHERE gallery_id = ?', [id]);

        if (existingRows.length === 0) {
            return res.status(404).json({ error: 'Gallery item not found.' });
        }

        const image_url = req.file ? req.file.path : existingRows[0].image_url;

        await db.execute(
            'UPDATE gallery SET title = ?, category = ?, image_url = ?, description = ? WHERE gallery_id = ?',
            [title, category, image_url, description, id]
        );

        const [updatedRows] = await db.execute('SELECT * FROM gallery WHERE gallery_id = ?', [id]);
        res.json(mapGalleryRow(updatedRows[0]));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.execute('DELETE FROM gallery WHERE gallery_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Gallery item not found.' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};