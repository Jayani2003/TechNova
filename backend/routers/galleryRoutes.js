const express = require('express');

const upload = require('../middleware/uploadMiddleware');
const {
	getGallery,
	addGalleryItem,
	updateGalleryItem,
	deleteGalleryItem,
} = require('../controllers/galleryController');

const router = express.Router();

router.get('/', getGallery);
router.post('/', upload.single('image'), addGalleryItem);
router.put('/:id', upload.single('image'), updateGalleryItem);
router.delete('/:id', deleteGalleryItem);

module.exports = router;