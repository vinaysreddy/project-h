import express from 'express';
import { authenticateUser, storeUserBasicDetails, getUserBasicDetails } from '../controllers/authController.js';
import { checkAuthentication } from '../middleware/auth.js';

const router = express.Router();

// User authentication (login/registration with Google)
router.post('/', authenticateUser);

// Store or update user basic details
router.post('/basic-details', checkAuthentication, storeUserBasicDetails);

// Get user basic details
router.get('/basic-details', checkAuthentication, getUserBasicDetails);

export default router;