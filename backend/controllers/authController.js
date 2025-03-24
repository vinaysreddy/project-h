import { db, firebaseAdmin } from '../config/firebase.js';

/**
 * Authenticate a user with Firebase Auth
 * Handles both new user registration and returning user login
 */
const authenticateUser = async (req, res) => {
    try {
        // Extract the ID token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const idToken = authHeader.split(' ')[1]; // Extract token after "Bearer "
        console.log("idToken    ", idToken);
        // Verify the ID token using Firebase Admin SDK
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);

        // Get user info from the decoded token
        const { uid, email, name, picture } = decodedToken;

        // Check if user exists in your database
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        // Check if basic details were provided in the request
        const basicDetails = req.body?.basicDetails || null;

        let isNewUser = false;

        if (!userDoc.exists) {
            // New user - create user document
            isNewUser = true;

            // Create user in 'users' collection
            await userRef.set({
                uid,
                email,
                displayName: name || '',
                photoURL: picture || '',
                createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebaseAdmin.firestore.FieldValue.serverTimestamp()
            });

            // If basic details were provided, store them
            if (basicDetails) {
                const userBasicDetailsRef = db.collection('user_basic_details').doc(uid);
                await userBasicDetailsRef.set({
                    userId: uid,
                    daily_activity_level: basicDetails.daily_activity_level || '',
                    dob: basicDetails.dob || '',
                    exercise_availability: basicDetails.exercise_availability || '',
                    gender: basicDetails.gender || '',
                    health_conditions: Array.isArray(basicDetails.health_conditions) ? basicDetails.health_conditions : [],
                    height_in_cm: basicDetails.height_in_cm || 0,
                    weight_in_kg: basicDetails.weight_in_kg || 0,
                    other_medical_conditions: basicDetails.other_medical_conditions || '',
                    primary_fitness_goal: basicDetails.primary_fitness_goal || '',
                    target_weight: basicDetails.target_weight || 0,
                    created_at: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
                    updated_at: firebaseAdmin.firestore.FieldValue.serverTimestamp()
                });
            }
        } else {
            // Existing user - update login time
            await userRef.update({
                lastLogin: firebaseAdmin.firestore.FieldValue.serverTimestamp()
            });

            // If basic details were provided, update them
            if (basicDetails) {
                const userBasicDetailsRef = db.collection('user_basic_details').doc(uid);
                const basicDetailsDoc = await userBasicDetailsRef.get();

                if (basicDetailsDoc.exists) {
                    // Update existing details
                    await userBasicDetailsRef.update({
                        ...basicDetails,
                        updated_at: firebaseAdmin.firestore.FieldValue.serverTimestamp()
                    });
                } else {
                    // Create new details document
                    await userBasicDetailsRef.set({
                        userId: uid,
                        daily_activity_level: basicDetails.daily_activity_level || '',
                        dob: basicDetails.dob || '',
                        exercise_availability: basicDetails.exercise_availability || '',
                        gender: basicDetails.gender || '',
                        health_conditions: Array.isArray(basicDetails.health_conditions) ? basicDetails.health_conditions : [],
                        height_in_cm: basicDetails.height_in_cm || 0,
                        weight_in_kg: basicDetails.weight_in_kg || 0,
                        other_medical_conditions: basicDetails.other_medical_conditions || '',
                        primary_fitness_goal: basicDetails.primary_fitness_goal || '',
                        target_weight: basicDetails.target_weight || 0,
                        created_at: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
                        updated_at: firebaseAdmin.firestore.FieldValue.serverTimestamp()
                    });
                }
            }
        }

        // Get user data to return in response
        const userData = {
            uid,
            email,
            displayName: name || '',
            photoURL: picture || '',
            isNewUser
        };

        // Get user's basic details if they exist
        const basicDetailsRef = db.collection('user_basic_details').doc(uid);
        const basicDetailsDoc = await basicDetailsRef.get();

        if (basicDetailsDoc.exists) {
            userData.basicDetails = basicDetailsDoc.data();
        }

        res.status(200).json({
            message: isNewUser ? 'User registered successfully' : 'User logged in successfully',
            user: userData
        });
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(401).json({ message: 'Authentication failed', error: error.message });
    }
};

/**
 * Store or update the user's basic details
 */
const storeUserBasicDetails = async (req, res) => {
    try {
        // Extract the ID token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const idToken = authHeader.split(' ')[1];

        // Verify the token
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // Get basic details from request body
        const basicDetails = req.body;

        if (!basicDetails) {
            return res.status(400).json({ message: 'No basic details provided' });
        }

        // Reference to the user's basic details document
        const basicDetailsRef = db.collection('user_basic_details').doc(uid);

        // Check if document exists
        const doc = await basicDetailsRef.get();

        if (doc.exists) {
            // Update existing document
            await basicDetailsRef.update({
                ...basicDetails,
                updated_at: firebaseAdmin.firestore.FieldValue.serverTimestamp()
            });

            res.status(200).json({
                message: 'Basic details updated successfully',
                userId: uid
            });
        } else {
            // Create new document
            await basicDetailsRef.set({
                userId: uid,
                ...basicDetails,
                created_at: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
                updated_at: firebaseAdmin.firestore.FieldValue.serverTimestamp()
            });

            res.status(201).json({
                message: 'Basic details created successfully',
                userId: uid
            });
        }
    } catch (error) {
        console.error('Error storing basic details:', error);
        res.status(500).json({ message: 'Failed to store basic details', error: error.message });
    }
};

/**
 * Get the user's basic details
 */
const getUserBasicDetails = async (req, res) => {
    try {
        // Extract the ID token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const idToken = authHeader.split(' ')[1];

        // Verify the token
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // Get user's basic details
        const basicDetailsRef = db.collection('user_basic_details').doc(uid);
        const doc = await basicDetailsRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Basic details not found' });
        }

        res.status(200).json({
            message: 'Basic details retrieved successfully',
            basicDetails: doc.data()
        });
    } catch (error) {
        console.error('Error retrieving basic details:', error);
        res.status(500).json({ message: 'Failed to retrieve basic details', error: error.message });
    }
};

export { authenticateUser, storeUserBasicDetails, getUserBasicDetails };