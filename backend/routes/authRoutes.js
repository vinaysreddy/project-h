import express from "express";
import { db } from "../config/firebase.js";
import authenticateUser from "../middleware/authenticateUser.js";

const router = express.Router();

// User Signup/Login (Google Authentication)
router.post("/signup", async (req, res) => {
    try {
        const { uid, email, name, photoURL } = req.body;

        const userRef = db.collection("users").doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            await userRef.set({ uid, email, name, photoURL, createdAt: new Date() });
        }

        res.status(200).json({ message: "User authenticated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error signing up", error: error.message });
    }
});

// Fetch User Info
router.get("/user", authenticateUser, async (req, res) => {
    try {
        // Get uid from the decoded token
        const uid = req.user.uid;
        
        if (!uid) {
            return res.status(400).json({ message: "Missing user ID" });
        }
        
        console.log("Looking up user with UID:", uid);
        
        // Find user in database
        const userRef = db.collection("users").doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            console.log("User not found in database:", uid);
            return res.status(404).json({ message: "User not found" });
        }

        // Return user data
        return res.status(200).json(userDoc.data());
    } catch (error) {
        console.error("Error in /auth/user route:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
