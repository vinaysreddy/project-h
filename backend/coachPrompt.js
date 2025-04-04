/**
 * Generates an optimized prompt for the AI health coach
 * @param {Object} userData - User profile and onboarding data
 * @param {Array} messages - Previous conversation messages
 * @param {String} message - Current user message
 * @returns {String} - Formatted prompt for the AI
 */
export const generateCoachPrompt = (userData, messages, message) => {
  // Extract key user data with fallbacks
  const name = userData?.displayName || userData?.name || 'User';
  const primaryGoal = userData?.primaryGoal || userData?.goal || 'general health';
  const age = userData?.age || 'unknown';
  const gender = userData?.gender || 'unknown';
  const height = userData?.height || 'unknown';
  const weight = userData?.weight || 'unknown';
  const bmi = userData?.bmi || userData?.healthMetrics?.bmi || 'unknown';
  const bmiCategory = userData?.bmiCategory || userData?.healthMetrics?.bmiCategory || 'unknown';
  
  // Health data
  const activityLevel = userData?.activityLevel || 'unknown';
  const workoutAccess = userData?.workoutAccess?.join(', ') || userData?.gymAccess || 'unknown';
  const dietPreference = userData?.dietPreference || userData?.dietType || userData?.diet_type || 'unknown';
  const sleepHours = userData?.sleepHours || userData?.sleep || 'unknown';
  const waterIntake = userData?.waterIntake || 'unknown';
  
  // Medical considerations
  const healthConditions = Array.isArray(userData?.healthConditions) 
    ? userData.healthConditions.join(', ') 
    : Array.isArray(userData?.health_conditions)
    ? userData.health_conditions.join(', ')
    : 'none reported';
    
  const allergies = Array.isArray(userData?.allergies)
    ? userData.allergies.join(', ')
    : 'none reported';
    
  const injuries = Array.isArray(userData?.injuries)
    ? userData.injuries.join(', ')
    : Array.isArray(userData?.movement_restrictions)
    ? userData.movement_restrictions.join(', ')
    : 'none reported';
  
  // Nutritional targets
  const calorieTarget = userData?.healthMetrics?.calorieTarget || userData?.calories || 'unknown';
  const proteinTarget = userData?.healthMetrics?.proteinTarget || userData?.protein || 'unknown';
  const carbsTarget = userData?.healthMetrics?.carbsTarget || userData?.carbs || 'unknown';
  const fatsTarget = userData?.healthMetrics?.fatsTarget || userData?.fats || 'unknown';
  
  // Get existing workout plan if available
  const hasWorkoutPlan = userData?.workout_plan ? true : false;
  const workoutPlanSummary = hasWorkoutPlan 
    ? `User has a ${userData?.workout_plan?.frequencyPerWeek || 3}-day workout plan focusing on ${userData?.workout_plan?.focus || 'general fitness'}.`
    : 'No workout plan generated yet.';
    
  // Get existing meal plan if available
  const hasMealPlan = userData?.meal_plan ? true : false; 
  const mealPlanSummary = hasMealPlan
    ? `User has a ${userData?.meal_plan?.meals_per_day || 3}-meal plan with ${userData?.meal_plan?.calories || 'unknown'} calories.`
    : 'No meal plan generated yet.';

  // Format previous messages
  const conversationHistory = messages.length > 0 
    ? messages.map(m => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`).join('\n')
    : 'No previous conversation.';
  
  return `
You are an AI fitness and wellness coach for the Project-H platform. IMPORTANT: You have access to the user's complete health profile listed below. Always use this specific data in your responses.

CRITICAL INSTRUCTION: When the user asks questions about their health status (like "Am I healthy?"), always analyze their BMI, weight, activity level, sleep, and other metrics to give a personalized assessment of their health status. Never provide generic responses when you have their actual data.

RESPONSE FORMAT: Start your responses with a direct answer that references specific metrics from their profile, then provide actionable advice tailored to their situation.

---

👤 User Profile:
Name: ${name}
Age: ${age}
Gender: ${gender}
Height: ${height}
Weight: ${weight}
BMI: ${bmi} (${bmiCategory}) <-- ALWAYS reference this when discussing health status
Goal: ${primaryGoal}
Activity Level: ${activityLevel} <-- ALWAYS reference this when discussing fitness
Workout Access: ${workoutAccess}
Diet Preference: ${dietPreference}
Sleep: ${sleepHours} <-- ALWAYS reference this when discussing health/recovery
Water Intake: ${waterIntake}

Medical Considerations:
- Health Conditions: ${healthConditions}
- Allergies: ${allergies}
- Injuries/Restrictions: ${injuries}

Nutrition Targets:
- Calories: ${calorieTarget}
- Protein: ${proteinTarget}
- Carbs: ${carbsTarget}
- Fats: ${fatsTarget}

Current Plans:
- Workout Plan: ${workoutPlanSummary}
- Meal Plan: ${mealPlanSummary}

---

📌 Guidelines:
- Always address the user by name.
- Base your advice on the provided health profile, even if not explicitly asked.
- If user's message relates to fitness, weight loss, or health, personalize your answer with context like BMI, diet, or sleep.
- Suggest actual routines: sample workouts, meal suggestions, hydration, sleep tips, etc.
- If the user's BMI is high, kindly recommend weight loss and outline steps.
- If the user asks general questions, frame the response in terms of **their specific data.**
- Encourage positive habits and trackable goals.
- Avoid generic advice; always relate back to their profile.
- Be clear, friendly, and supportive—but never too vague or robotic.
- Use emojis occasionally (1-2 per message) to appear friendly.
- Keep responses concise (2-4 sentences per topic) and actionable.

---

💬 Previous Conversation:
${conversationHistory}

---

Current User Message:
User: ${message}

Respond as a supportive AI health coach with practical, personalized advice:`;
};