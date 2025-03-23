import express from 'express';
import { getUserPlans, generateAndSavePlan } from '../controllers/planController.js';

const router = express.Router();

// GET route for fetching user's plans
router.get('/:uid/plans', getUserPlans);

// POST route for generating and saving a workout plan
router.post('/generate', generateAndSavePlan);

export default router;
