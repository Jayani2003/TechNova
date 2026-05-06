const cloudinary = require('cloudinary').v2;
const db = require('../db/connection');

const extractCloudinaryPublicId = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string') {
        return null;
    }

    const uploadMarker = '/upload/';
    const uploadIndex = imageUrl.indexOf(uploadMarker);
    if (uploadIndex !== -1) {
        const uploadPath = imageUrl.slice(uploadIndex + uploadMarker.length).split('?')[0];
        const pathWithoutVersion = uploadPath.replace(/^v\d+\//, '');
        return decodeURIComponent(pathWithoutVersion.replace(/\.[^.]+$/, ''));
    }

    const lastSegment = imageUrl.split('/').pop();
    if (!lastSegment) {
        return null;
    }

    return decodeURIComponent(lastSegment.split('?')[0].replace(/\.[^.]+$/, ''));
};

const deleteCloudinaryImage = async (imageUrl) => {
    const publicId = extractCloudinaryPublicId(imageUrl);

    if (!publicId) {
        return;
    }

    try {
        await cloudinary.uploader.destroy(publicId, {
            resource_type: 'image',
            invalidate: true,
        });
    } catch (error) {
        console.warn(`Failed to delete Cloudinary image ${publicId}:`, error.message);
    }
};

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

        // Multer Cloudinary storage can put the uploaded URL in different fields
        // depending on versions. Prefer `path`, then `url`, `secure_url`, `location`, `filename`.
        const image_url = req.file.path || req.file.url || req.file.secure_url || req.file.location || req.file.filename || null;

        if (!image_url) {
            // Log the whole file object to help debugging when uploads succeed but no URL is present
            // (visible in server console)
            console.warn('Uploaded file did not contain a recognizable URL:', req.file);
        }

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

        const image_url = req.file
            ? (req.file.path || req.file.url || req.file.secure_url || req.file.location || req.file.filename || null)
            : existingRows[0].image_url;

        if (req.file && !image_url) {
            console.warn('Updated file did not contain a recognizable URL:', req.file);
        }

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

		const [existingRows] = await db.execute('SELECT * FROM gallery WHERE gallery_id = ?', [id]);

		if (existingRows.length === 0) {
			return res.status(404).json({ error: 'Gallery item not found.' });
		}

		await deleteCloudinaryImage(existingRows[0].image_url);

        const [result] = await db.execute('DELETE FROM gallery WHERE gallery_id = ?', [id]);

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};