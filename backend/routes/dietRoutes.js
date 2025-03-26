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
router.post("/questionnaire/gen", authenticateUser, async (req, res) => {
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
router.get("/plan", authenticateUser, async (req, res) => {
    try {
        const { uid } = req.user;
        const dietRef = db.collection("diet_plans").doc(uid);
        const dietDoc = await dietRef.get();

        if (dietDoc.exists) {
            return res.status(200).json(dietDoc.data());
        }

        // Call OpenAI API (Skipping actual integration)
        const generatedPlan = { plan: "Generated diet plan from AI" };

        await dietRef.set(generatedPlan);

        res.status(200).json(generatedPlan);
    } catch (error) {
        res.status(500).json({ message: "Error fetching/generating diet plan", error: error.message });
    }
});

export default router;
