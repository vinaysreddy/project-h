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

// Send chat message endpoint with better error handling
router.post('/chat', authenticateUser, async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return res.status(500).json({ 
        success: false, 
        message: 'OpenAI API key configuration error' 
      });
    }

    const uid = req.user.uid;
    const { message, userData, healthMetrics } = req.body;
    
    console.log("Message received:", message);
    console.log("User data received:", JSON.stringify(userData));
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }
    
    // Try a simplified approach to minimize potential errors
    try {
      // Generate simple prompt to test OpenAI connection
      const simplePrompt = `You are a health coach. The user said: "${message}". Respond with brief health advice.`;
      
      console.log("Calling OpenAI API with simple prompt");
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Use a more widely available model
        messages: [
          {
            role: "system",
            content: "You are a helpful, supportive AI health coach."
          },
          {
            role: "user",
            content: simplePrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200 // Reducing to see if there's a token limit issue
      });
      
      console.log("OpenAI API response received");
      
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
      const chatDoc = await chatDocRef.get();
      
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
    } catch (innerError) {
      console.error('Detailed error in chat processing:', innerError);
      
      if (innerError.response && innerError.response.data) {
        console.error('OpenAI error details:', innerError.response.data);
      }
      
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to process your message',
        error: innerError.message
      });
    }
  } catch (error) {
    console.error('Error processing chat message:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to process your message', 
      error: error.message 
    });
  }
});

export default router;