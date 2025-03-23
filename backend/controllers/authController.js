import { firebaseAdmin, db } from '../config/firebase.js';

const authenticateUser = async (req, res) => {
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

        // Extract questionnaire data
        const questionnaireData = req.body?.questionnaireData;

        // Step 1: Store or update basic user information in the `users` collection
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            await userRef.set({
                email: decodedToken.email,
                name: decodedToken.name || '',
                uid: uid,
                createdAt: new Date(),
            });
        }

        // Step 2: Store or update the user's questionnaire data in `userProfiles` collection
        if (questionnaireData) {
            const userProfileRef = db.collection('userProfiles').doc(uid);  // Fixed collection name
            const userProfileDoc = await userProfileRef.get();

            const profileData = {
                dob: questionnaireData.dob,
                gender: questionnaireData.gender,
                height_in_cm: questionnaireData.height_in_cm,
                weight_in_kg: questionnaireData.weight_in_kg,
                primary_fitness_goal: questionnaireData.primary_fitness_goal,
                target_weight: ['fat_loss', 'gain_muscle'].includes(questionnaireData.primary_fitness_goal)
                    ? questionnaireData.target_weight
                    : null,
                daily_activity_level: questionnaireData.daily_activity_level,
                exercise_availability: questionnaireData.exercise_availability,
                health_conditions: questionnaireData.health_conditions || [],
                other_medical_conditions: questionnaireData.other_medical_conditions || '',
                updatedAt: new Date(),
            };

            if (!userProfileDoc.exists) {
                await userProfileRef.set({ ...profileData, createdAt: new Date() });
            } else {
                await userProfileRef.update(profileData);
            }
        }

        // Step 3: Send response
        res.status(200).json({
            message: 'User authenticated and profile stored successfully',
            uid: uid,
            email: decodedToken.email,
            name: decodedToken.name || '',
            questionnaireData: questionnaireData || null,
        });
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(401).json({ message: 'Authentication failed', error: error.message });
    }
};

const handleUserOnboarding = async (req, res) => {
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

        // Extract user data from request body
        const userData = req.body?.userData;

        if (!userData) {
            return res.status(400).json({ message: 'No user data provided' });
        }

        // Store or update the user's profile data in `userProfiles` collection
        const userProfileRef = db.collection('userProfiles').doc(uid);
        const userProfileDoc = await userProfileRef.get();

        const profileData = {
            dob: userData.dob,
            gender: userData.gender,
            height_in_cm: userData.height_in_cm,
            weight_in_kg: userData.weight_in_kg,
            primary_fitness_goal: userData.primary_fitness_goal,
            target_weight: ['fat_loss', 'gain_muscle'].includes(userData.primary_fitness_goal)
                ? userData.target_weight
                : null,
            daily_activity_level: userData.daily_activity_level,
            exercise_availability: userData.exercise_availability,
            health_conditions: userData.health_conditions || [],
            other_medical_conditions: userData.other_medical_conditions || '',
            updatedAt: new Date(),
        };

        if (!userProfileDoc.exists) {
            await userProfileRef.set({ ...profileData, createdAt: new Date() });
        } else {
            await userProfileRef.update(profileData);
        }

        res.status(200).json({
            message: 'User onboarding data stored successfully',
            uid: uid
        });
    } catch (error) {
        console.error('Error handling user onboarding:', error);
        res.status(401).json({ message: 'Onboarding failed', error: error.message });
    }
};

export { authenticateUser, handleUserOnboarding };
