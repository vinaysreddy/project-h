import express from 'express';
import { getUserPlans } from '../controllers/planController.js';
import { storeWorkout, generateAndSaveWorkout, generateAndSaveDiet } from '../controllers/workoutController.js';
import { storeDiet } from '../controllers/dietController.js';

const router = express.Router();

// GET route for fetching user's plans
// router.get('/:uid/plans', getUserPlans);

// POST routes for workout
router.post('/generate-workout', storeWorkout);
router.post('/generate-workout-plan', generateAndSaveWorkout);

// POST routes for diet
router.post('/generate-diet', storeDiet);
router.post('/generate-diet-plan', generateAndSaveDiet);

export default router;
