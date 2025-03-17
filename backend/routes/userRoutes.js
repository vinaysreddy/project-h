const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Get user profile
router.get('/profile', authenticateUser, userController.getUserProfile);

// Update user profile
router.post('/profile', authenticateUser, userController.updateUserProfile);

// Save fitness data
router.post('/fitness', authenticateUser, userController.saveFitnessData);

// Get fitness data
router.get('/fitness', authenticateUser, userController.getFitnessData);

module.exports = router;