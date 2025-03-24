import { db, firebaseAdmin } from '../config/firebase.js';

/**
 * Store a diet plan
 */
const storeDiet = async (req, res) => {
  try {
    // This is a simplified version that would need to be expanded
    // to handle authentication and proper data validation
    
    const { dietPlan, userId } = req.body;
    
    if (!dietPlan || !userId) {
      return res.status(400).json({
        message: 'Diet plan and userId are required'
      });
    }
    
    const planRef = db.collection('dietPlans').doc();
    
    await planRef.set({
      userId,
      dietPlan,
      createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      type: 'diet',
      name: `Diet Plan - ${new Date().toLocaleDateString()}`,
      isActive: true
    });
    
    res.status(201).json({
      message: 'Diet plan stored successfully',
      planId: planRef.id
    });
  } catch (error) {
    console.error('Error storing diet:', error);
    res.status(500).json({
      message: 'Failed to store diet',
      error: error.message
    });
  }
};

export { storeDiet };