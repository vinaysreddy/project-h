import express from 'express';
import { getUserData } from '../controllers/userController.js';

const router = express.Router();

// GET route for fetching user data
router.get('/:uid', getUserData);

export default router;
