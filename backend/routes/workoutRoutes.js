import express from "express";
import { db } from "../config/firebase.js";
import authenticateUser from "../middleware/authenticateUser.js";
import { generateWorkoutPlanPrompt, formatWorkoutPlan } from "../workoutPlanPrompt.js";
import { generatePlan } from "../services/openaiService.js";

const router = express.Router();

// Store Workout Questionnaire
router.post("/questionnaire", authenticateUser, async (req, res) => {
    try {
        const { uid } = req.user;
        const data = req.body;

        await db.collection("workout_questionnaire").doc(uid).set(data);

        res.status(200).json({ message: "Workout questionnaire saved" });
    } catch (error) {
        res.status(500).json({ message: "Error storing workout questionnaire", error: error.message });
    }
});

// Generate Workout Plan from Questionnaire
router.post("/gen", authenticateUser, async (req, res) => {
    try {
        const { uid } = req.user;

        const result = await generatePlan(
            uid,
            "workout_questionnaire",
            "workout_plans",
            generateWorkoutPlanPrompt,
            formatWorkoutPlan
        );

        return res.status(result.status).json(result);
    } catch (error) {
        console.error("API error:", error);
        res.status(500).json({
            message: "Error generating workout plan",
            error: error.message
        });
    }
});

// Get or Generate Workout Plan
// Get Workout Plan
router.get("/plan", authenticateUser, async (req, res) => {
    try {
        const { uid } = req.user;
        const workoutRef = db.collection("workout_plans").doc(uid);
        const workoutDoc = await workoutRef.get();

        if (workoutDoc.exists) {
            return res.status(200).json(workoutDoc.data());
        }

        return res.status(404).json({
            message: "No workout plan found for this user",
            error: "Please generate a workout plan first using the /gen endpoint"
        });
    } catch (error) {
        console.error("Error fetching workout plan:", error);
        res.status(500).json({ 
            message: "Error fetching workout plan", 
            error: error.message 
        });
    }
});

export default router;
