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

// Get User Questionnaire
router.get("/", authenticateUser, async (req, res) => {
    try {
        const { uid } = req.user; // Get user ID from Firebase Auth

        // Get questionnaire document from Firestore
        const docRef = db.collection("user_questionnaire").doc(uid);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Questionnaire not found for this user" });
        }

        // Return questionnaire data
        res.status(200).json({
            message: "Questionnaire retrieved successfully",
            data: doc.data()
        });
    } catch (error) {
        console.error("Error retrieving questionnaire:", error);
        res.status(500).json({
            message: "Error retrieving questionnaire",
            error: error.message
        });
    }
});

// Get User Questionnaire by ID (optional - for admin or sharing purposes)
router.get("/:id", authenticateUser, async (req, res) => {
    try {
        const { uid } = req.user; // Get user ID from Firebase Auth
        const { id } = req.params; // Get requested questionnaire ID

        // Optional: Check permissions (e.g., admin users or if the requested ID matches the authenticated user)
        if (id !== uid) {
            // You could check admin privileges here if needed
            // For now, we'll just restrict access to the user's own data
            return res.status(403).json({ message: "Not authorized to access this questionnaire" });
        }

        // Get questionnaire document from Firestore
        const docRef = db.collection("user_questionnaire").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Questionnaire not found" });
        }

        // Return questionnaire data
        res.status(200).json({
            message: "Questionnaire retrieved successfully",
            data: doc.data()
        });
    } catch (error) {
        console.error("Error retrieving questionnaire by ID:", error);
        res.status(500).json({
            message: "Error retrieving questionnaire",
            error: error.message
        });
    }
});

// Update User Questionnaire
router.put("/", authenticateUser, async (req, res) => {
    try {
        const { uid } = req.user; // Get user ID from Firebase Auth
        const data = req.body;

        // Get questionnaire document from Firestore
        const docRef = db.collection("user_questionnaire").doc(uid);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Questionnaire not found for this user" });
        }

        // Update questionnaire in Firestore
        await docRef.update(data);

        res.status(200).json({ message: "Questionnaire updated successfully" });
    } catch (error) {
        console.error("Error updating questionnaire:", error);
        res.status(500).json({
            message: "Error updating questionnaire",
            error: error.message
        });
    }
});

export default router;
