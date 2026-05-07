const express = require('express');
const router = express.Router();
const { login, register, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
 
router.post('/login', login);
router.post('/register', register);
router.get('/me', verifyToken, getMe); // validate stored token on app load
 
module.exports = router;
