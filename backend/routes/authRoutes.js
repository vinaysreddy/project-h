// authRoutes.js
import express from 'express';
import { authenticateUser } from '../controllers/authController.js';

const router = express.Router();

// POST route for authenticating user with Google ID token
router.post('/signin', authenticateUser);

export default router;
