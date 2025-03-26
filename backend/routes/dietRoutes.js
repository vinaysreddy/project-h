import express from "express";
import { db } from "../config/firebase.js";
import authenticateUser from "../middleware/authenticateUser.js";
import { generateMealPlanPrompt, formatMealPlan } from "../dietPlanPrompt.js";
import { generatePlan } from "../services/openaiService.js";

const router = express.Router();

// Store Diet Questionnaire
router.post("/questionnaire", authenticateUser, async (req, res) => {
    try {
        const { uid } = req.user;
        const data = req.body;

        await db.collection("diet_questionnaire").doc(uid).set(data);

        res.status(200).json({ message: "Diet questionnaire saved" });
    } catch (error) {
        res.status(500).json({ message: "Error storing diet questionnaire", error: error.message });
    }
});

// Generate Diet Plan from Questionnaire
router.post("/gen", authenticateUser, async (req, res) => {
    try {
        const { uid } = req.user;

        const result = await generatePlan(
            uid,
            "diet_questionnaire",
            "diet_plans",
            generateMealPlanPrompt,
            formatMealPlan
        );

        return res.status(result.status).json(result);
    } catch (error) {
        console.error("API error:", error);
        res.status(500).json({
            message: "Error generating diet plan",
            error: error.message
        });
    }
});

// Get or Generate Diet Plan
// Get Diet Plan
router.get("/plan", authenticateUser, async (req, res) => {
    try {
        const { uid } = req.user;
        const dietRef = db.collection("diet_plans").doc(uid);
        const dietDoc = await dietRef.get();

        if (dietDoc.exists) {
            return res.status(200).json(dietDoc.data());
        }

        return res.status(404).json({
            message: "No diet plan found for this user",
            error: "Please generate a diet plan first using the /gen endpoint"
        });
    } catch (error) {
        console.error("Error fetching diet plan:", error);
        res.status(500).json({ 
            message: "Error fetching diet plan", 
            error: error.message 
        });
    }
});

export default router;
