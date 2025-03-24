import { firebaseAdmin } from '../config/firebase.js';

/**
 * Middleware to verify Firebase authentication token
 */
export const checkAuthentication = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        
        const idToken = authHeader.split(' ')[1];
        
        // Verify the token
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        
        // Add the user ID to the request object
        req.uid = decodedToken.uid;
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name || '',
            picture: decodedToken.picture || ''
        };
        
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token', error: error.message });
    }
};