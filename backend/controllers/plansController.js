import { db, firebaseAdmin } from '../config/firebase.js';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { generateWorkoutPlanPrompt } from '../workoutPlanPrompt.js';
import { generateMealPlanPrompt } from '../dietPlanPrompt.js';

dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Get all workout plans for the authenticated user
 */
const getAllWorkoutPlans = async (req, res) => {
  try {
    // Get user ID from authentication middleware
    const uid = req.uid;

    // Get all workout plans for this user
    const workoutPlansRef = db.collection('workoutPlans')
      .where('userId', '==', uid)
      .where('type', '==', 'workout');
    
    const snapshot = await workoutPlansRef.get();
    
    if (snapshot.empty) {
      return res.status(200).json({
        message: 'No workout plans found',
        plans: []
      });
    }
    
    // Extract plan data
    const plans = [];
    snapshot.forEach(doc => {
      plans.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Sort plans by creation date (newest first)
    plans.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate();
      const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate();
      return dateB - dateA;
    });
    
    res.status(200).json({
      message: 'Workout plans retrieved successfully',
      plans: plans
    });
  } catch (error) {
    console.error('Error retrieving workout plans:', error);
    res.status(500).json({
      message: 'Failed to retrieve workout plans',
      error: error.message
    });
  }
};

/**
 * Get specific workout plan by ID
 */
const getWorkoutPlanById = async (req, res) => {
  try {
    const { planId } = req.params;
    const uid = req.uid;
    
    // Get the specific workout plan
    const planRef = db.collection('workoutPlans').doc(planId);
    const doc = await planRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        message: 'Workout plan not found'
      });
    }
    
    // Get plan data
    const planData = doc.data();
    
    // Check if plan belongs to this user
    if (planData.userId !== uid) {
      return res.status(403).json({
        message: 'You do not have permission to access this plan'
      });
    }
    
    res.status(200).json({
      message: 'Workout plan retrieved successfully',
      plan: {
        id: doc.id,
        ...planData
      }
    });
  } catch (error) {
    console.error('Error retrieving workout plan:', error);
    res.status(500).json({
      message: 'Failed to retrieve workout plan',
      error: error.message
    });
  }
};

/**
 * Get all diet plans for the authenticated user
 */
const getAllDietPlans = async (req, res) => {
  try {
    // Get user ID from authentication middleware
    const uid = req.uid;

    // Get all diet plans for this user
    const dietPlansRef = db.collection('dietPlans')
      .where('userId', '==', uid)
      .where('type', '==', 'diet');
    
    const snapshot = await dietPlansRef.get();
    
    if (snapshot.empty) {
      return res.status(200).json({
        message: 'No diet plans found',
        plans: []
      });
    }
    
    // Extract plan data
    const plans = [];
    snapshot.forEach(doc => {
      plans.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Sort plans by creation date (newest first)
    plans.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate();
      const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate();
      return dateB - dateA;
    });
    
    res.status(200).json({
      message: 'Diet plans retrieved successfully',
      plans: plans
    });
  } catch (error) {
    console.error('Error retrieving diet plans:', error);
    res.status(500).json({
      message: 'Failed to retrieve diet plans',
      error: error.message
    });
  }
};

/**
 * Get specific diet plan by ID
 */
const getDietPlanById = async (req, res) => {
  try {
    const { planId } = req.params;
    const uid = req.uid;
    
    // Get the specific diet plan
    const planRef = db.collection('dietPlans').doc(planId);
    const doc = await planRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        message: 'Diet plan not found'
      });
    }
    
    // Get plan data
    const planData = doc.data();
    
    // Check if plan belongs to this user
    if (planData.userId !== uid) {
      return res.status(403).json({
        message: 'You do not have permission to access this plan'
      });
    }
    
    res.status(200).json({
      message: 'Diet plan retrieved successfully',
      plan: {
        id: doc.id,
        ...planData
      }
    });
  } catch (error) {
    console.error('Error retrieving diet plan:', error);
    res.status(500).json({
      message: 'Failed to retrieve diet plan',
      error: error.message
    });
  }
};

/**
 * Generate a new workout plan based on questionnaire data
 */
const generateWorkoutPlan = async (req, res) => {
  try {
    // Get user ID from authentication middleware
    const uid = req.uid;
    
    // First, check if user has completed the fitness questionnaire
    const fitnessQuestionnaireRef = db.collection('fitness_questionnaires').doc(uid);
    const questionnaireDoc = await fitnessQuestionnaireRef.get();
    
    if (!questionnaireDoc.exists) {
      return res.status(400).json({
        message: 'Please complete the fitness questionnaire first before generating a workout plan'
      });
    }
    
    // Get questionnaire data
    const questionnaireData = questionnaireDoc.data();
    
    // Format the data for the OpenAI prompt
    const promptData = {
      fitness_goal: questionnaireData.fitnessGoal,
      fitness_level: questionnaireData.fitnessLevel,
      goal_timeline: questionnaireData.goalTimeline,
      intensity_level: questionnaireData.intensityLevel,
      health_conditions: questionnaireData.healthConditions || [],
      movements_to_avoid: questionnaireData.movementsToAvoid || [],
      days_per_week: questionnaireData.daysPerWeek,
      preferred_days: questionnaireData.preferredDays || [],
      session_duration: questionnaireData.sessionDuration,
      workout_style: questionnaireData.workoutStyle || "Balanced",
      workout_split: questionnaireData.workoutSplit || ["Full Body"],
      workout_environments: questionnaireData.workoutEnvironments || ["Home"],
      equipment_access: questionnaireData.equipmentAccess || ["None/minimal equipment"]
    };
    
    // Generate the prompt
    const prompt = generateWorkoutPlanPrompt(promptData);
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system", 
          content: "You must return raw JSON ONLY, with no explanations, backticks, or markdown. Never use ```json or ``` in your response."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 3000
    });
    
    // Process the response
    let workoutPlanContent = response.choices[0].message.content.trim();
    
    // Remove any markdown code block indicators if present
    workoutPlanContent = workoutPlanContent.replace(/^```json\n|^```\n|```$/g, '');
    
    let workoutPlan;
    try {
      workoutPlan = JSON.parse(workoutPlanContent);
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      
      // Try to extract JSON if still in code blocks
      try {
        const jsonMatch = workoutPlanContent.match(/```(?:json)?([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          const extractedJson = jsonMatch[1].trim();
          workoutPlan = JSON.parse(extractedJson);
        } else {
          return res.status(500).json({
            error: "Failed to parse workout plan from OpenAI response",
            raw_response: workoutPlanContent
          });
        }
      } catch (extractionError) {
        console.error("JSON extraction failed:", extractionError);
        return res.status(500).json({
          error: "Invalid JSON format received from OpenAI",
          raw_response: workoutPlanContent
        });
      }
    }
    
    // Create a new workout plan document
    const planRef = db.collection('workoutPlans').doc();
    
    // Add metadata to the plan
    const planData = {
      userId: uid,
      createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      type: 'workout',
      questionnaireData: promptData,
      workoutPlan: workoutPlan.workout_plan || workoutPlan,
      name: `Workout Plan - ${new Date().toLocaleDateString()}`, // Default name
      isActive: true,
      completedWorkouts: []
    };
    
    // Save to Firestore
    await planRef.set(planData);
    
    res.status(200).json({
      message: 'Workout plan generated successfully',
      planId: planRef.id,
      plan: {
        id: planRef.id,
        ...planData,
        workoutPlan: workoutPlan.workout_plan || workoutPlan
      }
    });
  } catch (error) {
    console.error('Error generating workout plan:', error);
    res.status(500).json({
      message: 'Failed to generate workout plan',
      error: error.message
    });
  }
};

/**
 * Generate a new diet plan based on questionnaire data
 */
const generateDietPlan = async (req, res) => {
  try {
    // Get user ID from authentication middleware
    const uid = req.uid;
    
    // First, check if user has completed the diet questionnaire
    const dietQuestionnaireRef = db.collection('diet_questionnaires').doc(uid);
    const questionnaireDoc = await dietQuestionnaireRef.get();
    
    if (!questionnaireDoc.exists) {
      return res.status(400).json({
        message: 'Please complete the diet questionnaire first before generating a diet plan'
      });
    }
    
    // Get questionnaire data
    const questionnaireData = questionnaireDoc.data();
    
    // Format the data for the OpenAI prompt
    const promptData = {
      goal: questionnaireData.goal,
      calories: questionnaireData.totalCalories,
      protein: questionnaireData.totalProtein,
      carbs: questionnaireData.totalCarbs,
      fats: questionnaireData.totalFats,
      diet_type: questionnaireData.dietType,
      meals_per_day: questionnaireData.mealsPerDay,
      food_restrictions: questionnaireData.foodRestrictions || [],
      allergies: questionnaireData.allergies || []
    };
    
    // Generate the prompt
    const prompt = generateMealPlanPrompt(promptData);
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system", 
          content: "You must return raw JSON ONLY, with no explanations, backticks, or markdown. Never use ```json or ``` in your response."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 3000
    });
    
    // Process the response
    let dietPlanContent = response.choices[0].message.content.trim();
    
    // Remove any markdown code block indicators if present
    dietPlanContent = dietPlanContent.replace(/^```json\n|^```\n|```$/g, '');
    
    let dietPlan;
    try {
      dietPlan = JSON.parse(dietPlanContent);
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      
      // Try to extract JSON if still in code blocks
      try {
        const jsonMatch = dietPlanContent.match(/```(?:json)?([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          const extractedJson = jsonMatch[1].trim();
          dietPlan = JSON.parse(extractedJson);
        } else {
          return res.status(500).json({
            error: "Failed to parse diet plan from OpenAI response",
            raw_response: dietPlanContent
          });
        }
      } catch (extractionError) {
        console.error("JSON extraction failed:", extractionError);
        return res.status(500).json({
          error: "Invalid JSON format received from OpenAI",
          raw_response: dietPlanContent
        });
      }
    }
    
    // Create a new diet plan document
    const planRef = db.collection('dietPlans').doc();
    
    // Add metadata to the plan
    const planData = {
      userId: uid,
      createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      type: 'diet',
      questionnaireData: promptData,
      dietPlan: dietPlan.meal_plan || dietPlan,
      name: `Meal Plan - ${new Date().toLocaleDateString()}`, // Default name
      isActive: true,
      completedMeals: []
    };
    
    // Save to Firestore
    await planRef.set(planData);
    
    res.status(200).json({
      message: 'Diet plan generated successfully',
      planId: planRef.id,
      plan: {
        id: planRef.id,
        ...planData,
        dietPlan: dietPlan.meal_plan || dietPlan
      }
    });
  } catch (error) {
    console.error('Error generating diet plan:', error);
    res.status(500).json({
      message: 'Failed to generate diet plan',
      error: error.message
    });
  }
};

export {
  getAllWorkoutPlans,
  getWorkoutPlanById,
  getAllDietPlans,
  getDietPlanById,
  generateWorkoutPlan,
  generateDietPlan
};