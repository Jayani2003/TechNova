const express = require('express');
const {
  getLocations,
  addLocation,
  updateLocation,
  deleteLocation,
} = require('../controllers/locationController');

const router = express.Router();

router.get('/', getLocations);
router.post('/', addLocation);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);

module.exports = router;
