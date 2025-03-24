import express from 'express';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import bodyParser from 'body-parser';
import { generateMealPlanPrompt } from './llm/dietPlanPrompt.js';
import { generateWorkoutPlanPrompt } from './llm/workoutPlanPrompt.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Diet generation endpoint
app.post('/api/generate-diet', async (req, res) => {
  try {
    const userData = req.body;
    
    // Generate enhanced prompt
    const prompt = generateMealPlanPrompt(userData);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system", 
          content: "You must return raw JSON ONLY, with no explanations, backticks, or markdown. Never use ```json or ``` in your response."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 3000
    });
    
    let dietPlanContent = response.choices[0].message.content.trim();
    console.log("Raw OpenAI Response:", dietPlanContent);
    
    // Remove any markdown code block indicators if present
    dietPlanContent = dietPlanContent.replace(/^```json\n|^```\n|```$/g, '');
    
    try {
      const dietPlan = JSON.parse(dietPlanContent);
      return res.status(200).json(dietPlan);
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      
      // Try to extract JSON if still in code blocks
      try {
        const jsonMatch = dietPlanContent.match(/```(?:json)?([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          const extractedJson = jsonMatch[1].trim();
          const dietPlan = JSON.parse(extractedJson);
          return res.status(200).json(dietPlan);
        }
      } catch (extractionError) {
        console.error("JSON extraction failed:", extractionError);
      }
      
      return res.status(500).json({
        error: "Invalid JSON format received from OpenAI",
        raw_response: dietPlanContent
      });
    }
  } catch (error) {
    console.error("API error:", error);
    if (error.name === 'OpenAIError') {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: `Unexpected error: ${error.message}` });
  }
});

// Workout plan generation endpoint
app.post('/api/generate-workout', async (req, res) => {
  try {
    const userData = req.body;
    
    // Generate enhanced workout prompt
    const prompt = generateWorkoutPlanPrompt(userData);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system", 
          content: "You must return raw JSON ONLY, with no explanations, backticks, or markdown. Never use ```json or ``` in your response."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 3000
    });
    
    let workoutPlanContent = response.choices[0].message.content.trim();
    console.log("Raw OpenAI Response (Workout):", workoutPlanContent);
    
    // Remove any markdown code block indicators if present
    workoutPlanContent = workoutPlanContent.replace(/^```json\n|^```\n|```$/g, '');
    
    try {
      const workoutPlan = JSON.parse(workoutPlanContent);
      return res.status(200).json(workoutPlan);
    } catch (jsonError) {
      console.error("JSON parsing error (Workout):", jsonError);
      
      // Try to extract JSON if still in code blocks
      try {
        const jsonMatch = workoutPlanContent.match(/```(?:json)?([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          const extractedJson = jsonMatch[1].trim();
          const workoutPlan = JSON.parse(extractedJson);
          return res.status(200).json(workoutPlan);
        }
      } catch (extractionError) {
        console.error("JSON extraction failed (Workout):", extractionError);
      }
      
      return res.status(500).json({
        error: "Invalid JSON format received from OpenAI",
        raw_response: workoutPlanContent
      });
    }
  } catch (error) {
    console.error("API error (Workout):", error);
    if (error.name === 'OpenAIError') {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: `Unexpected error: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;