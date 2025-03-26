import express from "express";
import { db } from "../config/firebase.js";
import authenticateUser from "../middleware/authenticateUser.js";

const router = express.Router();

// Store User Questionnaire **AFTER** Login
router.post("/", authenticateUser, async (req, res) => {
    try {
        const { uid } = req.user; // Get user ID from Firebase Auth
        const data = req.body;

        // Check if questionnaire already exists
        const docRef = db.collection("user_questionnaire").doc(uid);
        const doc = await docRef.get();

        if (doc.exists) {
            return res.status(400).json({ message: "Questionnaire already exists for this user" });
        }

        // Store questionnaire in Firestore
        await docRef.set(data);

        res.status(200).json({ message: "Questionnaire saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error storing questionnaire", error: error.message });
    }
});

export default router;
