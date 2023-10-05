const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router();

router.post('/login', authController.login);
router.post('/registration', authController.registration);
router.get('/check', authMiddleware, authController.check)

module.exports = router;