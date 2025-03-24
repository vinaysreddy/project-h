import express from 'express';
import { 
    getFitnessQuestionnaire, 
    getDietQuestionnaire,
    submitFitnessQuestionnaire,
    submitDietQuestionnaire 
} from '../controllers/questionnaireController.js';
import { checkAuthentication } from '../middleware/auth.js';

const router = express.Router();

// Retrieve a specific fitness questionnaire by ID
router.get('/fitness/:questionnaireId', checkAuthentication, getFitnessQuestionnaire);

// Retrieve a specific diet questionnaire by ID
router.get('/diet/:questionnaireId', checkAuthentication, getDietQuestionnaire);

// Submit a new fitness questionnaire for workout plan generation
router.post('/fitness', checkAuthentication, submitFitnessQuestionnaire);

// Submit a new diet questionnaire for diet plan generation
router.post('/diet', checkAuthentication, submitDietQuestionnaire);

export default router;