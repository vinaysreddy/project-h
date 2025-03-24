import express from 'express';
import {
    getAllWorkoutPlans,
    getWorkoutPlanById,
    getAllDietPlans,
    getDietPlanById,
    generateWorkoutPlan,
    generateDietPlan
} from '../controllers/plansController.js';
import { storeWorkout, generateAndSaveWorkout, generateAndSaveDiet } from '../controllers/workoutController.js';
import { storeDiet } from '../controllers/dietController.js';
import { checkAuthentication } from '../middleware/auth.js';

const router = express.Router();

// Retrieve all workout plans created for the user
router.get('/workout', checkAuthentication, getAllWorkoutPlans);

// Retrieve a specific workout plan by ID
router.get('/workout/:planId', checkAuthentication, getWorkoutPlanById);

// Retrieve all diet plans created for the user
router.get('/diet', checkAuthentication, getAllDietPlans);

// Retrieve a specific diet plan by ID
router.get('/diet/:planId', checkAuthentication, getDietPlanById);

// Generate a new workout plan based on the user's profile and questionnaire responses
router.post('/workout/generate', checkAuthentication, generateWorkoutPlan);

// Generate a new diet plan based on the user's profile and questionnaire responses
router.post('/diet/generate', checkAuthentication, generateDietPlan);

// Legacy routes - consider if you need these
router.post('/generate-workout', checkAuthentication, storeWorkout);
router.post('/generate-workout-plan', checkAuthentication, generateAndSaveWorkout);
router.post('/generate-diet', checkAuthentication, storeDiet);
router.post('/generate-diet-plan', checkAuthentication, generateAndSaveDiet);

export default router;
