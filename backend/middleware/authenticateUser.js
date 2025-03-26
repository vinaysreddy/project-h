import admin from "../config/firebase.js";

const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    console.log("token  ", token);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Attach user info to request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

export default authenticateUser;
