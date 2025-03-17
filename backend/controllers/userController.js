const { db } = require('../config/firebase');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json(userDoc.data());
  } catch (error) {
    console.error('Error getting user profile:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const userData = req.body;
    
    // Validate request data
    if (!userData) {
      return res.status(400).json({ error: 'No data provided' });
    }
    
    // Update user in Firestore
    await db.collection('users').doc(userId).set({
      ...userData,
      updatedAt: new Date()
    }, { merge: true });
    
    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Save fitness data
exports.saveFitnessData = async (req, res) => {
  try {
    const userId = req.user.uid;
    const fitnessData = req.body;
    
    // Validate request data
    if (!fitnessData) {
      return res.status(400).json({ error: 'No data provided' });
    }
    
    // Add fitness data to Firestore
    const result = await db.collection('users').doc(userId).collection('fitness').add({
      ...fitnessData,
      createdAt: new Date()
    });
    
    return res.status(201).json({ 
      message: 'Fitness data saved successfully',
      id: result.id
    });
  } catch (error) {
    console.error('Error saving fitness data:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get fitness data
exports.getFitnessData = async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const snapshot = await db.collection('users').doc(userId).collection('fitness')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();
    
    const fitnessData = [];
    snapshot.forEach(doc => {
      fitnessData.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return res.status(200).json(fitnessData);
  } catch (error) {
    console.error('Error getting fitness data:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};