import { firebaseAdmin, db } from '../config/firebase.js';
import { OpenAI } from 'openai';
import { generateMealPlanPrompt } from '../dietPlanPrompt.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Stores diet questionnaire data in Firestore for the logged-in user
 * Updates existing data if it already exists
 */
const storeDiet = async (req, res) => {
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

        // Extract diet questionnaire data from request body
        const dietInputData = req.body?.dietInputData;
        console.log("Diet input data received:", dietInputData);

        if (!dietInputData) {
            return res.status(400).json({ message: 'No diet data provided' });
        }

        // Ensure the data has the required fields
        const formattedData = {
            goal: dietInputData.goal,
            totalCalories: parseInt(dietInputData.totalCalories),
            totalProtein: parseInt(dietInputData.totalProtein),
            totalCarbs: parseInt(dietInputData.totalCarbs),
            totalFats: parseInt(dietInputData.totalFats),
            dietType: dietInputData.dietType,
            mealsPerDay: parseInt(dietInputData.mealsPerDay),
            foodRestrictions: Array.isArray(dietInputData.foodRestrictions) ? dietInputData.foodRestrictions : [],
            allergies: Array.isArray(dietInputData.allergies) ? dietInputData.allergies : [],
            updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp()
        };

        // Reference to the user's diet questionnaire document
        const dietDocRef = db.collection('dietData').doc(uid);

        // Check if the document already exists
        const docSnapshot = await dietDocRef.get();

        if (docSnapshot.exists) {
            // Document exists - update it
            console.log("Updating existing diet data for user:", uid);
            await dietDocRef.update(formattedData);
        } else {
            // Document doesn't exist - create it
            console.log("Creating new diet data for user:", uid);
            await dietDocRef.set({
                ...formattedData,
                userId: uid,
                createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp()
            });
        }

        // Return success response
        res.status(200).json({
            message: docSnapshot.exists ?
                'Diet data updated successfully' :
                'Diet data created successfully',
            uid: uid,
            dietInputData: {
                goal: formattedData.goal,
                totalCalories: formattedData.totalCalories,
                totalProtein: formattedData.totalProtein,
                totalCarbs: formattedData.totalCarbs,
                totalFats: formattedData.totalFats,
                dietType: formattedData.dietType,
                mealsPerDay: formattedData.mealsPerDay,
                foodRestrictions: formattedData.foodRestrictions,
                allergies: formattedData.allergies
            }
        });
    } catch (error) {
        console.error('Error storing diet data:', error);
        res.status(500).json({
            message: 'Failed to store diet data',
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

        // Save the generated diet plan to Firestore
        const dietPlanRef = db.collection('plans').doc(uid).collection('dietPlans').doc();

        await dietPlanRef.set({
            plan: dietPlan,
            createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
            isActive: true,
            baseData: formattedData
        });

        // Return the generated plan and its ID
        res.status(200).json({
            message: 'Diet plan generated and saved successfully',
            planId: dietPlanRef.id,
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

// Export both functions
export { storeDiet, generateAndSaveDiet };