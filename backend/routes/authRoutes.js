import express from 'express';
import { authenticateUser, handleUserOnboarding } from '../controllers/authController.js';
import { getUserProfile } from '../controllers/userController.js';

const router = express.Router();

// Route for authentication - matches frontend URL: http://localhost:3000/api/authenticate
router.post('/authenticate', authenticateUser);

// Route for user onboarding - matches frontend URL: http://localhost:3000/api/user/onboarding
router.post('/user/onboarding', handleUserOnboarding);

// Route to get the profile of the logged-in user
router.get('/profile', getUserProfile);

export default router;