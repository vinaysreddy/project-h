import express from 'express';
import { getUserDetails, updateUserDetails } from '../controllers/userController.js';
import { checkAuthentication } from '../middleware/auth.js';

const router = express.Router();

// Retrieve the user's basic details including height, weight, fitness goals, etc.
router.get('/details', checkAuthentication, getUserDetails);

// Update or create the user's basic details like height, weight, and fitness goals
router.put('/details', checkAuthentication, updateUserDetails);

export default router;