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

const parseTags = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim()) {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch (_error) {
            return [];
        }
    }
    return [];
};

const mapGalleryRow = (row) => ({
	id: row.gallery_id,
	title: row.title,
    image: row.image_url,
    loc: row.location_name || '',
    season: row.season || 'dry',
    mood: row.mood || 'adventure',
    event: row.event,
    status: row.status || 'draft',
    tourist: row.tourist_name || 'Unknown traveler',
    date: row.captured_date,
    desc: row.description || '',
    tags: parseTags(row.tags),
    withTourists: Boolean(row.with_tourists),
	created_at: row.created_at,
});

exports.addGalleryItem = async (req, res) => {
    try {
        const {
            title,
            description,
            location,
            season,
            mood,
            event,
            tourist,
            date,
            status,
            tags,
            withTourists,
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: 'Title is required.' });
        }

        if (!location || !location.trim()) {
            return res.status(400).json({ error: 'Location is required.' });
        }

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

        const [locRows] = await db.execute('SELECT location_id FROM gallery_location WHERE name = ? LIMIT 1', [location.trim()]);
        if (locRows.length === 0) {
            return res.status(400).json({ error: 'Selected location does not exist.' });
        }
        const locationId = locRows[0].location_id;

        let parsedTags = [];
        if (typeof tags === 'string' && tags.trim()) {
            try {
                const maybeArray = JSON.parse(tags);
                if (Array.isArray(maybeArray)) parsedTags = maybeArray;
            } catch (_error) {
                parsedTags = [];
            }
        }

        const sql = `
            INSERT INTO gallery (
                title, image_url, description, location_id,
                season, mood, event, tourist_name, captured_date,
                tags, with_tourists, status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [
            title.trim(),
            image_url,
            description || null,
            locationId,
            season || 'dry',
            mood || 'adventure',
            event || null,
            tourist || null,
            date || null,
            JSON.stringify(parsedTags),
            String(withTourists) === 'true',
            status === 'published' ? 'published' : 'draft',
        ]);

        const [rows] = await db.execute(
            `SELECT g.*, l.name AS location_name
             FROM gallery g
             LEFT JOIN gallery_location l ON l.location_id = g.location_id
             WHERE g.gallery_id = ?`,
            [result.insertId]
        );

        res.status(201).json(mapGalleryRow(rows[0]));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getGallery = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT g.*, l.name AS location_name
             FROM gallery g
             LEFT JOIN gallery_location l ON l.location_id = g.location_id
             ORDER BY g.created_at DESC`
        );
        res.json(rows.map(mapGalleryRow));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, location, season, mood, event, tourist, date, status, tags, withTourists } = req.body;

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

        let locationId = existingRows[0].location_id;
        if (location && location.trim()) {
            const [locRows] = await db.execute('SELECT location_id FROM gallery_location WHERE name = ? LIMIT 1', [location.trim()]);
            if (locRows.length === 0) {
                return res.status(400).json({ error: 'Selected location does not exist.' });
            }
            locationId = locRows[0].location_id;
        }

        let parsedTags = existingRows[0].tags;
        if (typeof tags === 'string') {
            if (!tags.trim()) {
                parsedTags = JSON.stringify([]);
            } else {
                try {
                    const maybeArray = JSON.parse(tags);
                    parsedTags = JSON.stringify(Array.isArray(maybeArray) ? maybeArray : []);
                } catch (_error) {
                    parsedTags = JSON.stringify([]);
                }
            }
        }

        await db.execute(
            `UPDATE gallery
             SET title = ?, image_url = ?, description = ?, location_id = ?,
                 season = ?, mood = ?, event = ?, tourist_name = ?, captured_date = ?,
                 tags = ?, with_tourists = ?, status = ?
             WHERE gallery_id = ?`,
            [
                title || existingRows[0].title,
                image_url,
                description ?? existingRows[0].description,
                locationId,
                season || existingRows[0].season,
                mood || existingRows[0].mood,
                event ?? existingRows[0].event,
                tourist ?? existingRows[0].tourist_name,
                date ?? existingRows[0].captured_date,
                parsedTags,
                typeof withTourists === 'undefined' ? existingRows[0].with_tourists : String(withTourists) === 'true',
                status === 'published' ? 'published' : status === 'draft' ? 'draft' : existingRows[0].status,
                id,
            ]
        );

        const [updatedRows] = await db.execute(
            `SELECT g.*, l.name AS location_name
             FROM gallery g
             LEFT JOIN gallery_location l ON l.location_id = g.location_id
             WHERE g.gallery_id = ?`,
            [id]
        );
        res.json(mapGalleryRow(updatedRows[0]));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateGalleryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (status !== 'draft' && status !== 'published') {
            return res.status(400).json({ error: 'Status must be draft or published.' });
        }

        const [existingRows] = await db.execute('SELECT gallery_id FROM gallery WHERE gallery_id = ?', [id]);
        if (existingRows.length === 0) {
            return res.status(404).json({ error: 'Gallery item not found.' });
        }

        await db.execute('UPDATE gallery SET status = ? WHERE gallery_id = ?', [status, id]);

        const [updatedRows] = await db.execute(
            `SELECT g.*, l.name AS location_name
             FROM gallery g
             LEFT JOIN gallery_location l ON l.location_id = g.location_id
             WHERE g.gallery_id = ?`,
            [id]
        );

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

		await db.execute('DELETE FROM gallery WHERE gallery_id = ?', [id]);

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};