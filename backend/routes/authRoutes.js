import express from 'express';
import { authenticateUser, handleUserOnboarding } from '../controllers/authController.js';

const router = express.Router();

// Route for authentication - matches frontend URL: http://localhost:3000/api/authenticate
router.post('/authenticate', authenticateUser);

// Route for user onboarding - matches frontend URL: http://localhost:3000/api/user/onboarding
router.post('/user/onboarding', handleUserOnboarding);

export default router;