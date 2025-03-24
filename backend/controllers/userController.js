import { firebaseAdmin, db } from '../config/firebase.js';

/**
 * Get user data of the currently logged-in user
 */
const getUserData = async (req, res) => {
    try {
        // Extract the ID token from the request header
        const { idToken } = req.headers;  
        console.log("idtoken      ",idToken);

        if (!idToken) {
            return res.status(400).json({ message: 'ID token is required' });
        }

        // Verify the ID token using Firebase Admin SDK
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid; // Get the UID from the decoded token

        // Fetch user data from Firestore using the UID
        const userDoc = await db.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user data if the user exists
        res.status(200).json({
            message: 'User data retrieved successfully',
            user: userDoc.data(),
        });
    } catch (error) {
        console.error('Error getting user data:', error);
        res.status(500).json({ message: 'Failed to retrieve user data', error: error.message });
    }
};

/**
 * Get comprehensive profile of the currently logged-in user
 * Including user data, profile data, workout data, diet data, and plans
 */
const getUserProfile = async (req, res) => {
    try {
        // Extract the ID token from the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const idToken = authHeader.split(' ')[1]; // Extract token after "Bearer "

        // Verify the ID token using Firebase Admin SDK
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid; // Get the UID from the decoded token

        // Create an object to store all user data
        const userProfile = {
            uid: uid,
            basicInfo: null,
            profile: null,
            workoutData: null,
            dietData: null,
            plans: {
                workout: [],
                diet: []
            }
        };

        // Get basic user info
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            // Remove sensitive information
            delete userData.password;
            userProfile.basicInfo = userData;
        }

        // Get user profile data
        const profileDoc = await db.collection('userProfiles').doc(uid).get();
        if (profileDoc.exists) {
            userProfile.profile = profileDoc.data();
        }

        // Get workout data if available
        const workoutDoc = await db.collection('workoutData').doc(uid).get();
        if (workoutDoc.exists) {
            userProfile.workoutData = workoutDoc.data();
        }

        // Get diet data if available
        const dietDoc = await db.collection('dietData').doc(uid).get();
        if (dietDoc.exists) {
            userProfile.dietData = dietDoc.data();
        }

        // Get user's plans
        const plansSnapshot = await db.collection('plans').where('userId', '==', uid).get();
        
        if (!plansSnapshot.empty) {
            // Process each plan and categorize by type
            plansSnapshot.forEach(doc => {
                const plan = {
                    id: doc.id,
                    ...doc.data()
                };
                
                // Check the type field to categorize
                if (plan.type === 'workout') {
                    userProfile.plans.workout.push(plan);
                } else if (plan.type === 'diet') {
                    userProfile.plans.diet.push(plan);
                }
            });
        }

        res.status(200).json({
            message: 'User profile retrieved successfully',
            profile: userProfile
        });
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ 
            message: 'Failed to retrieve user profile', 
            error: error.message 
        });
    }
};

export { getUserData, getUserProfile };
