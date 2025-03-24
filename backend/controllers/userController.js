import { db, firebaseAdmin } from '../config/firebase.js';

/**
 * Get user details including height, weight, fitness goals, etc.
 * This retrieves data from the user_basic_details collection
 */
const getUserDetails = async (req, res) => {
    try {
        // User ID is available from the checkAuthentication middleware
        const uid = req.uid;
        
        if (!uid) {
            return res.status(400).json({ message: 'User ID not found in request' });
        }
        
        // Get user details from Firestore
        const userDocRef = db.collection('users').doc(uid);
        const userDoc = await userDocRef.get();
        
        // Get user basic details from Firestore
        const userDetailsRef = db.collection('user_basic_details').doc(uid);
        const userDetailsDoc = await userDetailsRef.get();
        
        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Combine user data and user details data
        const userData = userDoc.data();
        
        // Create response object
        const responseData = {
            uid: uid,
            email: userData.email,
            displayName: userData.displayName || '',
            photoURL: userData.photoURL || '',
            createdAt: userData.createdAt,
            lastLogin: userData.lastLogin,
            basicDetails: userDetailsDoc.exists ? userDetailsDoc.data() : null
        };
        
        // Remove sensitive information if any
        delete responseData.password;
        
        res.status(200).json({
            message: 'User details retrieved successfully',
            user: responseData
        });
    } catch (error) {
        console.error('Error retrieving user details:', error);
        res.status(500).json({ 
            message: 'Failed to retrieve user details', 
            error: error.message 
        });
    }
};

/**
 * Update or create the user's basic details like height, weight, and fitness goals
 * This updates data in the user_basic_details collection
 */
const updateUserDetails = async (req, res) => {
    try {
        // User ID is available from the checkAuthentication middleware
        const uid = req.uid;
        
        if (!uid) {
            return res.status(400).json({ message: 'User ID not found in request' });
        }
        
        // Extract user details from request body
        const userDetails = req.body;
        
        if (!userDetails) {
            return res.status(400).json({ message: 'No user details provided' });
        }
        
        // Validate the required fields
        if (!userDetails.height_in_cm && !userDetails.weight_in_kg && !userDetails.primary_fitness_goal) {
            return res.status(400).json({ 
                message: 'At least one of height_in_cm, weight_in_kg, or primary_fitness_goal must be provided' 
            });
        }
        
        // Create an object with the fields to update
        const updateData = {
            ...userDetails,
            updated_at: firebaseAdmin.firestore.FieldValue.serverTimestamp()
        };
        
        // Reference to the user's basic details document
        const userDetailsRef = db.collection('user_basic_details').doc(uid);
        
        // Check if the document already exists
        const docSnapshot = await userDetailsRef.get();
        
        if (docSnapshot.exists) {
            // Document exists - update it
            await userDetailsRef.update(updateData);
            
            // Get the updated document
            const updatedDoc = await userDetailsRef.get();
            
            res.status(200).json({
                message: 'User details updated successfully',
                userId: uid,
                basicDetails: updatedDoc.data()
            });
        } else {
            // Document doesn't exist - create it
            await userDetailsRef.set({
                userId: uid,
                ...updateData,
                created_at: firebaseAdmin.firestore.FieldValue.serverTimestamp()
            });
            
            // Get the newly created document
            const newDoc = await userDetailsRef.get();
            
            res.status(201).json({
                message: 'User details created successfully',
                userId: uid,
                basicDetails: newDoc.data()
            });
        }
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({ 
            message: 'Failed to update user details', 
            error: error.message 
        });
    }
};

/**
 * Get the full user profile including all associated data
 * This aggregates data from multiple collections
 */
const getUserProfile = async (req, res) => {
    try {
        // User ID is available from the checkAuthentication middleware
        const uid = req.uid;
        
        if (!uid) {
            return res.status(400).json({ message: 'User ID not found in request' });
        }
        
        // Create an object to store all user data
        const userProfile = {
            uid: uid,
            basicInfo: null,
            basicDetails: null,
            fitnessQuestionnaire: null,
            dietQuestionnaire: null,
            plans: {
                workout: [],
                diet: []
            }
        };
        
        // Get basic user info from 'users' collection
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            // Remove sensitive information
            delete userData.password;
            userProfile.basicInfo = userData;
        }
        
        // Get user basic details from 'user_basic_details' collection
        const basicDetailsDoc = await db.collection('user_basic_details').doc(uid).get();
        if (basicDetailsDoc.exists) {
            userProfile.basicDetails = basicDetailsDoc.data();
        }
        
        // Get fitness questionnaire data from 'fitness_questionnaires' collection
        const fitnessDoc = await db.collection('fitness_questionnaires').doc(uid).get();
        if (fitnessDoc.exists) {
            userProfile.fitnessQuestionnaire = fitnessDoc.data();
        }
        
        // Get diet questionnaire data from 'diet_questionnaires' collection
        const dietDoc = await db.collection('diet_questionnaires').doc(uid).get();
        if (dietDoc.exists) {
            userProfile.dietQuestionnaire = dietDoc.data();
        }
        
        // Get user's plans from 'plans' collection
        const plansSnapshot = await db.collection('plans').where('userId', '==', uid).get();
        
        if (!plansSnapshot.empty) {
            // Process each plan and categorize by type
            plansSnapshot.forEach(doc => {
                const plan = {
                    id: doc.id,
                    ...doc.data()
                };
                
                // Check the plan type field to categorize
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

/**
 * Delete a user account and all associated data
 */
const deleteUser = async (req, res) => {
    try {
        // User ID is available from the checkAuthentication middleware
        const uid = req.uid;
        
        if (!uid) {
            return res.status(400).json({ message: 'User ID not found in request' });
        }
        
        // Start a batch operation
        const batch = db.batch();
        
        // Delete user document
        const userRef = db.collection('users').doc(uid);
        batch.delete(userRef);
        
        // Delete user basic details
        const basicDetailsRef = db.collection('user_basic_details').doc(uid);
        batch.delete(basicDetailsRef);
        
        // Delete fitness questionnaire
        const fitnessRef = db.collection('fitness_questionnaires').doc(uid);
        batch.delete(fitnessRef);
        
        // Delete diet questionnaire
        const dietRef = db.collection('diet_questionnaires').doc(uid);
        batch.delete(dietRef);
        
        // Get and delete user's plans
        const plansSnapshot = await db.collection('plans').where('userId', '==', uid).get();
        
        if (!plansSnapshot.empty) {
            plansSnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
        }
        
        // Commit the batch
        await batch.commit();
        
        // Delete the user from Firebase Auth
        await firebaseAdmin.auth().deleteUser(uid);
        
        res.status(200).json({
            message: 'User account and all associated data deleted successfully',
            userId: uid
        });
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ 
            message: 'Failed to delete user account', 
            error: error.message 
        });
    }
};

export { getUserDetails, updateUserDetails, getUserProfile, deleteUser };