import { db, firebaseAdmin } from '../config/firebase.js';

/**
 * Submit a fitness questionnaire for workout plan generation
 */
const submitFitnessQuestionnaire = async (req, res) => {
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

        // Extract fitness questionnaire data from request body
        const fitnessData = req.body?.fitnessData;
        
        if (!fitnessData) {
            return res.status(400).json({ message: 'No fitness questionnaire data provided' });
        }

        // Validate required fields
        if (!fitnessData.fitnessGoal) {
            return res.status(400).json({ message: 'Fitness goal is required' });
        }

        // Ensure the data has the required fields with defaults if not provided
        const formattedData = {
            fitnessGoal: fitnessData.fitnessGoal || 'General fitness',
            fitnessLevel: fitnessData.fitnessLevel || 'Beginner',
            goalTimeline: fitnessData.goalTimeline || 'Within 3-6 months (Moderate)',
            intensityLevel: fitnessData.intensityLevel || 'Moderate',
            healthConditions: Array.isArray(fitnessData.healthConditions) ? fitnessData.healthConditions : [],
            movementsToAvoid: Array.isArray(fitnessData.movementsToAvoid) ? fitnessData.movementsToAvoid : [],
            daysPerWeek: fitnessData.daysPerWeek || 3,
            preferredDays: Array.isArray(fitnessData.preferredDays) ? fitnessData.preferredDays : [],
            sessionDuration: fitnessData.sessionDuration || "30-45 minutes",
            workoutStyle: fitnessData.workoutStyle || "Balanced",
            workoutSplit: Array.isArray(fitnessData.workoutSplit) ? fitnessData.workoutSplit : ["Full Body"],
            workoutEnvironments: Array.isArray(fitnessData.workoutEnvironments) ? fitnessData.workoutEnvironments : ["Home"],
            equipmentAccess: Array.isArray(fitnessData.equipmentAccess) ? fitnessData.equipmentAccess : ["None/minimal equipment"],
            equipmentDescription: fitnessData.equipmentDescription || "Basic home equipment",
            updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp()
        };

        // Reference to the user's fitness questionnaire document
        const fitnessDocRef = db.collection('fitness_questionnaires').doc(uid);

        // Check if the document already exists
        const docSnapshot = await fitnessDocRef.get();

        if (docSnapshot.exists) {
            // Document exists - update it
            console.log("Updating existing fitness questionnaire for user:", uid);
            await fitnessDocRef.update(formattedData);
        } else {
            // Document doesn't exist - create it
            console.log("Creating new fitness questionnaire for user:", uid);
            await fitnessDocRef.set({
                ...formattedData,
                userId: uid,
                createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp()
            });
        }

        // Return success response
        res.status(200).json({
            message: docSnapshot.exists ?
                'Fitness questionnaire updated successfully' :
                'Fitness questionnaire created successfully',
            uid: uid,
            fitnessData: formattedData
        });
    } catch (error) {
        console.error('Error storing fitness questionnaire:', error);
        res.status(500).json({
            message: 'Failed to store fitness questionnaire',
            error: error.message
        });
    }
};

/**
 * Get fitness questionnaire data for a specific user
 */
const getFitnessQuestionnaire = async (req, res) => {
    try {
        const { questionnaireId } = req.params;
        let uid = questionnaireId;

        // If authenticated, can either get own data or use ID in params
        // If not specifying an ID, use the authenticated user's ID
        if (!uid || uid === 'me') {
            // Extract the ID token from the Authorization header
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Unauthorized: No token provided' });
            }
            
            const idToken = authHeader.split(' ')[1];
            
            // Verify the token
            const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
            uid = decodedToken.uid;
        }

        // Get fitness questionnaire data
        const fitnessDocRef = db.collection('fitness_questionnaires').doc(uid);
        const docSnapshot = await fitnessDocRef.get();

        if (!docSnapshot.exists) {
            return res.status(404).json({ message: 'Fitness questionnaire not found for this user' });
        }

        // Return the data
        res.status(200).json({
            message: 'Fitness questionnaire retrieved successfully',
            userId: uid,
            fitnessData: docSnapshot.data()
        });
    } catch (error) {
        console.error('Error retrieving fitness questionnaire:', error);
        res.status(500).json({
            message: 'Failed to retrieve fitness questionnaire',
            error: error.message
        });
    }
};

/**
 * Submit a diet questionnaire for diet plan generation
 */
const submitDietQuestionnaire = async (req, res) => {
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
        const dietData = req.body?.dietData;
        
        if (!dietData) {
            return res.status(400).json({ message: 'No diet questionnaire data provided' });
        }

        // Validate minimum required fields
        if (!dietData.goal) {
            return res.status(400).json({ message: 'Diet goal is required' });
        }

        // Ensure the data has the required fields with defaults if not provided
        const formattedData = {
            goal: dietData.goal || 'maintenance',
            totalCalories: parseInt(dietData.totalCalories) || 2000,
            totalProtein: parseInt(dietData.totalProtein) || 120,
            totalCarbs: parseInt(dietData.totalCarbs) || 200,
            totalFats: parseInt(dietData.totalFats) || 65,
            dietType: dietData.dietType || 'balanced',
            mealsPerDay: parseInt(dietData.mealsPerDay) || 3,
            foodRestrictions: Array.isArray(dietData.foodRestrictions) ? dietData.foodRestrictions : [],
            allergies: Array.isArray(dietData.allergies) ? dietData.allergies : [],
            // Include meal macros if they're in the request
            mealMacros: Array.isArray(dietData.mealMacros) ? dietData.mealMacros : [],
            updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp()
        };

        // Reference to the user's diet questionnaire document
        const dietDocRef = db.collection('diet_questionnaires').doc(uid);

        // Check if the document already exists
        const docSnapshot = await dietDocRef.get();

        if (docSnapshot.exists) {
            // Document exists - update it
            console.log("Updating existing diet questionnaire for user:", uid);
            await dietDocRef.update(formattedData);
        } else {
            // Document doesn't exist - create it
            console.log("Creating new diet questionnaire for user:", uid);
            await dietDocRef.set({
                ...formattedData,
                userId: uid,
                createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp()
            });
        }

        // Return success response
        res.status(200).json({
            message: docSnapshot.exists ?
                'Diet questionnaire updated successfully' :
                'Diet questionnaire created successfully',
            uid: uid,
            dietData: formattedData
        });
    } catch (error) {
        console.error('Error storing diet questionnaire:', error);
        res.status(500).json({
            message: 'Failed to store diet questionnaire',
            error: error.message
        });
    }
};

/**
 * Get diet questionnaire data for a specific user
 */
const getDietQuestionnaire = async (req, res) => {
    try {
        const { questionnaireId } = req.params;
        let uid = questionnaireId;

        // If authenticated, can either get own data or use ID in params
        // If not specifying an ID, use the authenticated user's ID
        if (!uid || uid === 'me') {
            // Extract the ID token from the Authorization header
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Unauthorized: No token provided' });
            }
            
            const idToken = authHeader.split(' ')[1];
            
            // Verify the token
            const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
            uid = decodedToken.uid;
        }

        // Get diet questionnaire data
        const dietDocRef = db.collection('diet_questionnaires').doc(uid);
        const docSnapshot = await dietDocRef.get();

        if (!docSnapshot.exists) {
            return res.status(404).json({ message: 'Diet questionnaire not found for this user' });
        }

        // Return the data
        res.status(200).json({
            message: 'Diet questionnaire retrieved successfully',
            userId: uid,
            dietData: docSnapshot.data()
        });
    } catch (error) {
        console.error('Error retrieving diet questionnaire:', error);
        res.status(500).json({
            message: 'Failed to retrieve diet questionnaire',
            error: error.message
        });
    }
};

export { 
    submitFitnessQuestionnaire, 
    getFitnessQuestionnaire,
    submitDietQuestionnaire,
    getDietQuestionnaire
};