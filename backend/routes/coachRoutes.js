import express from 'express';
import { OpenAI } from 'openai';
import authenticateUser from '../middleware/authenticateUser.js';
import { db } from '../config/firebase.js';
import admin from 'firebase-admin';

const router = express.Router();
const FieldValue = admin.firestore.FieldValue;

// Initialize OpenAI client with error checking
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Check OpenAI API key
console.log("OpenAI API Key available:", !!process.env.OPENAI_API_KEY);

// Basic coach prompt function
const generateCoachPrompt = (userData, messages, message) => {
  // Extract key user data with safe defaults
  const name = userData?.displayName || 'User';
  const primaryGoal = userData?.primaryGoal || 'general health';
  const age = userData?.age || 'unknown';
  const bmiCategory = userData?.healthMetrics?.bmiCategory || 'unknown';
  const height = userData?.height || 'unknown';
  const weight = userData?.weight || 'unknown';
  const healthConditions = Array.isArray(userData?.healthConditions) 
    ? userData.healthConditions.join(', ') 
    : 'none reported';
  const calorieTarget = userData?.healthMetrics?.calorieTarget || 'unknown';
  
  // Create a simple prompt format
  return `
You are an AI health and fitness coach assisting a user in achieving their health goals.

## USER PROFILE:
- Name: ${name}
- Primary fitness goal: ${primaryGoal}
- Age: ${age}
- Height: ${height}
- Weight: ${weight}
- BMI category: ${bmiCategory}
- Health conditions: ${healthConditions}
- Daily calorie target: ${calorieTarget} calories

## CURRENT USER MESSAGE:
User: ${message}

Respond as a supportive and knowledgeable health coach with practical advice.`;
};

// Get chat history endpoint
router.get('/history', authenticateUser, async (req, res) => {
  try {
    const uid = req.user.uid;
    
    // Fetch chat history from Firestore
    const chatDoc = await db.collection('coach_chats').doc(uid).get();
    
    if (!chatDoc.exists) {
      return res.status(200).json({ 
        messages: [] 
      });
    }
    
    return res.status(200).json({
      messages: chatDoc.data().messages || []
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch chat history' 
    });
  }
});

// Send chat message endpoint
router.post('/chat', authenticateUser, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { message, userData, healthMetrics } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }
    
    // Fetch user's onboarding data for context
    const onboardingDoc = await db.collection('onboarding_data').doc(uid).get();
    const userDataFromDb = onboardingDoc.exists ? onboardingDoc.data() : {};
    
    // Fetch workout plan if available
    const workoutPlanDoc = await db.collection('workout_plans').doc(uid).get();
    const workoutPlan = workoutPlanDoc.exists ? workoutPlanDoc.data() : {};
    
    // Fetch diet plan if available
    const dietPlanDoc = await db.collection('diet_plans').doc(uid).get();
    const dietPlan = dietPlanDoc.exists ? dietPlanDoc.data() : {};
    
    // Fetch workout questionnaire
    const workoutQDoc = await db.collection('workout_questionnaire').doc(uid).get();
    const workoutQData = workoutQDoc.exists ? workoutQDoc.data() : {};
    
    // Fetch diet questionnaire
    const dietQDoc = await db.collection('diet_questionnaire').doc(uid).get();
    const dietQData = dietQDoc.exists ? dietQDoc.data() : {};
    
    // Fetch existing chat history
    const chatHistoryDoc = await db.collection('coach_chats').doc(uid).get(); // Changed variable name here
    const chatHistory = chatHistoryDoc.exists ? chatHistoryDoc.data().messages || [] : []; // Changed reference here
    
    // Keep only last 10 messages for context window efficiency
    const recentMessages = chatHistory.slice(-10);
    
    // Generate prompt with comprehensive user context
    const combinedUserData = {
      ...userDataFromDb,
      ...userData,
      ...workoutQData,
      ...dietQData,
      healthMetrics: healthMetrics || {},
      workout_plan: workoutPlan.plan || workoutPlan.workout_plan,
      meal_plan: dietPlan.plan || dietPlan.meal_plan
    };
    
    console.log("Combined user data profile:", JSON.stringify(combinedUserData, null, 2));
    
    const prompt = generateCoachPrompt(combinedUserData, recentMessages, message);
    
    // Call OpenAI API with system message explicitly including profile context
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use the latest model version
      messages: [
        {
          role: "system",
          content: "You are a personalized health coach with full access to the user's profile data. IMPORTANT: When users ask about their health status, always refer to their specific BMI, weight, activity level, sleep hours and other profile data when responding. Never give generic responses when specific user data is available."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    // Extract response
    const coachResponse = response.choices[0].message.content.trim();
    
    // Generate IDs for messages
    const userMessageId = `user-${Date.now()}`;
    const coachMessageId = `coach-${Date.now()}`;
    
    // New messages to add
    const userMessage = {
      id: userMessageId,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString() // Use ISO string instead of server timestamp for now
    };
    
    const aiMessage = {
      id: coachMessageId,
      role: 'assistant',
      content: coachResponse,
      timestamp: new Date().toISOString() // Use ISO string instead of server timestamp for now
    };
    
    console.log("Saving messages to Firestore");
    
    // First check if the document exists
    const chatDocRef = db.collection('coach_chats').doc(uid);
    const chatDoc = await chatDocRef.get(); // This creates the second declaration of chatDoc
    
    if (!chatDoc.exists) {
      // Create the document with initial messages
      await chatDocRef.set({
        messages: [userMessage, aiMessage],
        updated_at: new Date().toISOString()
      });
    } else {
      // Update existing document
      await chatDocRef.update({
        messages: admin.firestore.FieldValue.arrayUnion(userMessage, aiMessage),
        updated_at: new Date().toISOString()
      });
    }
    
    console.log("Messages saved successfully");
    
    // Return success with AI response
    return res.status(200).json({
      success: true,
      id: coachMessageId,
      message: coachResponse
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to process your message', 
      error: error.message 
    });
  }
});

// Get AI Summary endpoint
router.post('/summary', authenticateUser, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { context } = req.body;
    
    // Fetch user's onboarding data for context
    const onboardingDoc = await db.collection('onboarding_data').doc(uid).get();
    const userDataFromDb = onboardingDoc.exists ? onboardingDoc.data() : {};
    
    // Fetch workout plan if available
    const workoutPlanDoc = await db.collection('workout_plans').doc(uid).get();
    const workoutPlan = workoutPlanDoc.exists ? workoutPlanDoc.data() : {};
    
    // Fetch diet plan if available
    const dietPlanDoc = await db.collection('diet_plans').doc(uid).get();
    const dietPlan = dietPlanDoc.exists ? dietPlanDoc.data() : {};
    
    // Get user's most recent data from the request
    const { userData, healthMetrics } = req.body;
    
    // Combine all the data
    const combinedUserData = {
      ...userDataFromDb,
      ...userData,
      healthMetrics: healthMetrics || {},
      workout_plan: workoutPlan.plan || workoutPlan.workout_plan,
      meal_plan: dietPlan.plan || dietPlan.meal_plan
    };
    
    // Create a prompt for the summary based on context
    let prompt = `Generate a brief, personalized health summary for a user with the following profile:\n\n`;
    prompt += `Name: ${combinedUserData.displayName || 'User'}\n`;
    prompt += `BMI: ${healthMetrics?.bmi || 'unknown'} (${healthMetrics?.bmiCategory || 'unknown'})\n`;
    prompt += `Primary Goal: ${combinedUserData.primaryGoal || 'general health'}\n`;
    prompt += `Height: ${combinedUserData.height || 'unknown'}\n`;
    prompt += `Weight: ${combinedUserData.weight || 'unknown'}\n`;
    prompt += `Calorie Target: ${healthMetrics?.calorieTarget || 'unknown'}\n\n`;
    
    // Add context-specific instructions
    if (context === 'nutrition') {
      prompt += `Focus on their nutrition needs and dietary recommendations for their ${healthMetrics?.bmiCategory || 'current'} BMI and ${combinedUserData.primaryGoal || 'health'} goals.`;
    } else if (context === 'fitness') {
      prompt += `Focus on their fitness needs and exercise recommendations for their ${healthMetrics?.bmiCategory || 'current'} BMI and ${combinedUserData.primaryGoal || 'health'} goals.`;
    } else {
      prompt += `Provide a general health overview and recommendations based on their current metrics and goals.`;
    }
    
    prompt += `\n\nKeep the summary brief (2-3 sentences), personalized, and actionable. Start with "Hi [name]!"`;
    
    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Or your preferred model
      messages: [
        {
          role: "system",
          content: "You are a helpful AI health coach that provides personalized summaries based on user health data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });
    
    const summary = response.choices[0].message.content.trim();
    
    return res.status(200).json({
      success: true,
      summary
    });
    
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate summary',
      error: error.message
    });
  }
});

export default router;