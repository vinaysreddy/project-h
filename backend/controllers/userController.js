import { firebaseAdmin, db } from '../config/firebase.js';

const getUserData = async (req, res) => {
    try {
        // Step 1: Get the ID token from the request header (or body, depending on your implementation)
        const { idToken } = req.headers;  // Assuming the token is sent in the request header

        if (!idToken) {
            return res.status(400).json({ message: 'ID token is required' });
        }

        // Step 2: Verify the ID token using Firebase Admin SDK
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid; // Get the UID from the decoded token

        // Step 3: Fetch user data from Firestore using the UID
        const userDoc = await db.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 4: Return the user data if the user exists
        res.status(200).json({
            message: 'User data retrieved successfully',
            user: userDoc.data(),
        });
    } catch (error) {
        console.error('Error getting user data:', error);
        res.status(500).json({ message: 'Failed to retrieve user data', error });
    }
};

export { getUserData };
