const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { verifyToken } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public route to fetch all activities
router.get('/', activityController.getAllActivities);

// Admin routes to manage activities
router.post('/', verifyToken, adminOnly, activityController.addActivity);
router.delete('/:id', verifyToken, adminOnly, activityController.deleteActivity);

module.exports = router;
