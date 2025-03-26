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
        // Get uid from the decoded token instead of query params
        const uid = req.user.uid;

        if (!uid) {
            return res.status(400).json({ message: "User ID not found in token" });
        }

        const userRef = db.collection("users").doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(userDoc.data());
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
});

export default router;
