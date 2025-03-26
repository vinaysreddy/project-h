import express from "express";
import { db } from "../config/firebase.js";

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
router.get("/user", async (req, res) => {
    try {
        const { uid } = req.query;
        const userRef = db.collection("users").doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(userDoc.data());
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
});

export default router;
