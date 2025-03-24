import { firebaseAdmin, db } from '../config/firebase.js';
import { OpenAI } from 'openai';
import { generateWorkoutPlanPrompt } from '../workoutPlanPrompt.js';
import { generateMealPlanPrompt } from '../dietPlanPrompt.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Stores workout questionnaire data in Firestore for the logged-in user
 * Updates existing data if it already exists
 */
const storeWorkout = async (req, res) => {
    try {
        // Extract the ID token from the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const idToken = authHeader.split(' ')[1]; // Extract token after "Bearer "

        // Verify the ID token using Firebase Admin SDK
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid; // Extract user UID

        // Extract workout questionnaire data from request body
        const workoutInputData = req.body?.workoutInputData;
        console.log("Workout input data received:", workoutInputData);

        if (!workoutInputData) {
            return res.status(400).json({ message: 'No workout data provided' });
        }

        // Ensure the data has the required fields
        const formattedData = {
            fitnessGoal: workoutInputData.fitnessGoal || '',
            fitnessLevel: workoutInputData.fitnessLevel || '',
            goalTimeline: workoutInputData.goalTimeline || '',
            intensityLevel: workoutInputData.intensityLevel || '',
            healthConditions: Array.isArray(workoutInputData.healthConditions) ? workoutInputData.healthConditions : [],
            movementsToAvoid: Array.isArray(workoutInputData.movementsToAvoid) ? workoutInputData.movementsToAvoid : [],
            updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp()
        };

        // Reference to the user's workout questionnaire document
        // Using user's UID as the document ID for easy retrieval/updates
        const workoutDocRef = db.collection('workoutData').doc(uid);

        // Check if the document already exists
        const docSnapshot = await workoutDocRef.get();

        if (docSnapshot.exists) {
            // Document exists - update it
            console.log("Updating existing workout data for user:", uid);
            await workoutDocRef.update(formattedData);
        } else {
            // Document doesn't exist - create it
            console.log("Creating new workout data for user:", uid);
            await workoutDocRef.set({
                ...formattedData,
                userId: uid,
                createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp()
            });
        }

        // Return success response
        res.status(200).json({
            message: docSnapshot.exists ?
                'Workout data updated successfully' :
                'Workout data created successfully',
            uid: uid,
            workoutInputData: {
                fitnessGoal: formattedData.fitnessGoal,
                fitnessLevel: formattedData.fitnessLevel,
                goalTimeline: formattedData.goalTimeline,
                intensityLevel: formattedData.intensityLevel,
                healthConditions: formattedData.healthConditions,
                movementsToAvoid: formattedData.movementsToAvoid
            }
        });
    } catch (error) {
        console.error('Error storing workout data:', error);
        res.status(500).json({
            message: 'Failed to store workout data',
            error: error.message
        });
    }
};

/**
 * Generates and saves a workout plan based on the user's questionnaire data
 */
const generateAndSaveWorkout = async (req, res) => {
    try {
        // Extract the ID token from the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const idToken = authHeader.split(' ')[1]; // Extract token after "Bearer "

        // Verify the ID token using Firebase Admin SDK
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid; // Extract user UID

        // First, get the user's workout questionnaire data from Firestore
        const workoutDataRef = db.collection('workoutData').doc(uid);
        const workoutDoc = await workoutDataRef.get();

        if (!workoutDoc.exists) {
            return res.status(404).json({ message: 'No workout data found for this user. Please complete the workout questionnaire first.' });
        }

        const workoutData = workoutDoc.data();

        // Format the data to match what the workout plan prompt expects
        const formattedData = {
            fitness_goal: workoutData.fitnessGoal || 'General fitness',
            fitness_level: workoutData.fitnessLevel || 'Intermediate',
            goal_timeline: workoutData.goalTimeline || 'Within 3-6 months (Moderate)',
            intensity_level: workoutData.intensityLevel || 'Moderate',
            health_conditions: Array.isArray(workoutData.healthConditions) ? workoutData.healthConditions : [],
            movements_to_avoid: Array.isArray(workoutData.movementsToAvoid) ? workoutData.movementsToAvoid : [],
            days_per_week: 3,  // Default value, you could add this to your questionnaire
            session_duration: "30-45 minutes",  // Default value
            workout_environments: ["Home", "Gym"],  // Default value
            equipment_access: ["None/minimal equipment"] // Default value
        };

        // Generate the workout plan using the OpenAI API
        const prompt = generateWorkoutPlanPrompt(formattedData);

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

        let workoutPlanContent = response.choices[0].message.content.trim();

        // Remove any markdown code block indicators if present
        workoutPlanContent = workoutPlanContent.replace(/^```json\n|^```\n|```$/g, '');

        // Parse the JSON response
        const workoutPlan = JSON.parse(workoutPlanContent);

        // Check if a plan already exists for this user
        const plansRef = db.collection('plans');
        const existingPlans = await plansRef.where('userId', '==', uid).get();

        let planRef;

        if (!existingPlans.empty) {
            // Update the existing plan
            planRef = existingPlans.docs[0].ref;
            await planRef.update({
                workoutPlan: workoutPlan,
                workoutData: formattedData,
                updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp()
            });
        } else {
            // Create a new plan
            planRef = db.collection('plans').doc();
            await planRef.set({
                userId: uid,
                createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
                workoutPlan: workoutPlan,
                workoutData: formattedData
            });
        }

        // Return the generated plan and its ID
        res.status(200).json({
            message: 'Workout plan generated and saved successfully',
            planId: planRef.id,
            plan: workoutPlan
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
 * Generates and saves a diet plan based on the user's questionnaire data
 */
const generateAndSaveDiet = async (req, res) => {
    try {
        // Extract the ID token from the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const idToken = authHeader.split(' ')[1]; // Extract token after "Bearer "

        // Verify the ID token using Firebase Admin SDK
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid; // Extract user UID

        // First, get the user's diet questionnaire data from Firestore
        const dietDataRef = db.collection('dietData').doc(uid);
        const dietDoc = await dietDataRef.get();

        if (!dietDoc.exists) {
            return res.status(404).json({ message: 'No diet data found for this user. Please complete the diet questionnaire first.' });
        }

        const dietData = dietDoc.data();

        // Format the data to match what the diet plan prompt expects
        const formattedData = {
            goal: dietData.goal,
            calories: dietData.totalCalories,
            protein: dietData.totalProtein,
            carbs: dietData.totalCarbs,
            fats: dietData.totalFats,
            diet_type: dietData.dietType,
            meals_per_day: dietData.mealsPerDay,
            food_restrictions: dietData.foodRestrictions,
            allergies: dietData.allergies,
            // Add these default values to match what generateMealPlanPrompt expects
            mealTypes: ["breakfast", "lunch", "dinner", "snack"],
            mealMacros: [
                {
                    mealType: "breakfast",
                    timing: "8:00 AM",
                    calories: Math.round(dietData.totalCalories * 0.3),
                    protein: Math.round(dietData.totalProtein * 0.3),
                    carbs: Math.round(dietData.totalCarbs * 0.3),
                    fats: Math.round(dietData.totalFats * 0.3)
                },
                {
                    mealType: "lunch",
                    timing: "1:00 PM",
                    calories: Math.round(dietData.totalCalories * 0.35),
                    protein: Math.round(dietData.totalProtein * 0.35),
                    carbs: Math.round(dietData.totalCarbs * 0.35),
                    fats: Math.round(dietData.totalFats * 0.35)
                },
                {
                    mealType: "dinner",
                    timing: "7:00 PM",
                    calories: Math.round(dietData.totalCalories * 0.35),
                    protein: Math.round(dietData.totalProtein * 0.35),
                    carbs: Math.round(dietData.totalCarbs * 0.35),
                    fats: Math.round(dietData.totalFats * 0.35)
                }
            ]
        };

        // Generate the diet plan using the OpenAI API
        const prompt = generateMealPlanPrompt(formattedData);

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

        let dietPlanContent = response.choices[0].message.content.trim();

        // Remove any markdown code block indicators if present
        dietPlanContent = dietPlanContent.replace(/^```json\n|^```\n|```$/g, '');

        // Parse the JSON response
        const dietPlan = JSON.parse(dietPlanContent);

        // Check if a plan already exists for this user
        const plansRef = db.collection('plans');
        const existingPlans = await plansRef.where('userId', '==', uid).get();

        let planRef;

        if (!existingPlans.empty) {
            // Update the existing plan
            planRef = existingPlans.docs[0].ref;
            await planRef.update({
                dietPlan: dietPlan,
                dietData: formattedData,
                updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp()
            });
        } else {
            // Create a new plan
            planRef = db.collection('plans').doc();
            await planRef.set({
                userId: uid,
                createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
                dietPlan: dietPlan,
                dietData: formattedData
            });
        }

        // Return the generated plan and its ID
        res.status(200).json({
            message: 'Diet plan generated and saved successfully',
            planId: planRef.id,
            plan: dietPlan
        });
    } catch (error) {
        console.error('Error generating diet plan:', error);
        res.status(500).json({
            message: 'Failed to generate diet plan',
            error: error.message
        });
    }
};

export { storeWorkout, generateAndSaveWorkout, generateAndSaveDiet };