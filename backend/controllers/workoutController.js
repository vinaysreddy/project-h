import { db, firebaseAdmin } from '../config/firebase.js';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { generateWorkoutPlanPrompt } from '../workoutPlanPrompt.js';

dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Store a workout plan without using questionnaire data
 */
const storeWorkout = async (req, res) => {
  try {
    // This is a simplified version that would need to be expanded
    // to handle authentication and proper data validation
    
    const { workoutPlan, userId } = req.body;
    
    if (!workoutPlan || !userId) {
      return res.status(400).json({
        message: 'Workout plan and userId are required'
      });
    }
    
    const planRef = db.collection('workoutPlans').doc();
    
    await planRef.set({
      userId,
      workoutPlan,
      createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      type: 'workout',
      name: `Workout Plan - ${new Date().toLocaleDateString()}`,
      isActive: true
    });
    
    res.status(201).json({
      message: 'Workout plan stored successfully',
      planId: planRef.id
    });
  } catch (error) {
    console.error('Error storing workout:', error);
    res.status(500).json({
      message: 'Failed to store workout',
      error: error.message
    });
  }
};

/**
 * Generate and save a workout plan
 */
const generateAndSaveWorkout = async (req, res) => {
  try {
    // This function would need authentication and proper data validation
    // For now, we'll redirect to the main generateWorkoutPlan function from plansController
    
    // Import the function dynamically to avoid circular dependencies
    const { generateWorkoutPlan } = await import('./plansController.js');
    
    // Add uid to the request object (this would normally be done by middleware)
    req.uid = req.body.userId;
    
    // Call the main function
    return generateWorkoutPlan(req, res);
  } catch (error) {
    console.error('Error generating and saving workout:', error);
    res.status(500).json({
      message: 'Failed to generate and save workout',
      error: error.message
    });
  }
};

/**
 * Generate and save a diet plan (referenced from workout controller)
 */
const generateAndSaveDiet = async (req, res) => {
  try {
    // Import the function dynamically to avoid circular dependencies
    const { generateDietPlan } = await import('./plansController.js');
    
    // Add uid to the request object (this would normally be done by middleware)
    req.uid = req.body.userId;
    
    // Call the main function
    return generateDietPlan(req, res);
  } catch (error) {
    console.error('Error generating and saving diet:', error);
    res.status(500).json({
      message: 'Failed to generate and save diet',
      error: error.message
    });
  }
};

export { storeWorkout, generateAndSaveWorkout, generateAndSaveDiet };