import { db } from '../config/firebase.js';

// Example function to get workout plans for a user
const getUserPlans = async (req, res) => {
    try {
        const { uid } = req.params;

        // Fetch the workout and diet plans from Firestore
        const workoutPlans = await db.collection('plans').doc(uid).collection('workoutPlans').get();
        const dietPlans = await db.collection('plans').doc(uid).collection('dietPlans').get();

        const workoutPlansData = workoutPlans.docs.map(doc => doc.data());
        const dietPlansData = dietPlans.docs.map(doc => doc.data());

        res.status(200).json({
            message: 'User plans retrieved successfully',
            workoutPlans: workoutPlansData,
            dietPlans: dietPlansData,
        });
    } catch (error) {
        console.error('Error getting user plans:', error);
        res.status(500).json({ message: 'Failed to retrieve plans', error });
    }
};

// Example function to generate and save a new workout plan
const generateAndSavePlan = async (req, res) => {
    try {
        const { uid, planData } = req.body;

        // Save new plan to Firestore (You can integrate OpenAI here)
        await db.collection('plans').doc(uid).collection('workoutPlans').add(planData);

        res.status(200).json({
            message: 'Workout plan generated and saved successfully',
            planData,
        });
    } catch (error) {
        console.error('Error generating workout plan:', error);
        res.status(500).json({ message: 'Failed to generate workout plan', error });
    }
};

export { getUserPlans, generateAndSavePlan };
