import { firebaseAdmin } from '../config/firebase.js';

const authenticateUser = async (req, res, next) => {
    try {
        // Get the auth header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("Missing or invalid authorization header");
            return res.status(401).json({ message: "Unauthorized: No valid authorization header" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            console.log("Token is empty");
            return res.status(401).json({ message: "Unauthorized: Token not provided" });
        }

        try {
            // Use firebaseAdmin instead of admin
            const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

            // Add the decoded token to the request object
            req.user = decodedToken;

            console.log("Token verified successfully for user:", decodedToken.uid);
            next();
        } catch (verifyError) {
            console.error("Token verification failed:", verifyError);

            // Provide more detailed error information in development
            if (process.env.NODE_ENV !== 'production') {
                return res.status(401).json({
                    message: "Unauthorized: Invalid token",
                    error: verifyError.message,
                    code: verifyError.code
                });
            }

            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    } catch (error) {
        console.error("Authentication middleware error:", error);
        return res.status(500).json({ message: "Authentication error", error: error.message });
    }
};

export default authenticateUser;
