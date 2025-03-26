/* Handles API calls to fetch diet plans */

import axios from 'axios';

/**
 * Fetches a diet plan from the API
 * @param {Object} userData - User data and preferences
 * @returns {Promise<Object>} - The diet plan data
 */
export const fetchDietPlan = async (userData) => {
  try {
    // If the user already has diet preferences, use those directly
    if (userData.dietPreference) {
      console.log('Using existing diet preferences');
    }
    
    // Prepare the request payload
    const payload = {
      calories: userData.calorieTarget || 2000,
      protein: userData.macros?.protein || 150, // In grams
      carbs: userData.macros?.carbs || 200,     // In grams
      fats: userData.macros?.fat || 70,         // In grams
      meals_per_day: userData.mealsPerDay || 4,
      diet_type: userData.dietPreference || userData.dietType || 'balanced',
      food_restrictions: userData.foodRestrictions || [],
      allergies: userData.allergies || [],
      goal: mapGoalToApiFormat(userData.primaryGoal)
    };

    console.log('Sending diet plan generation request with payload:', payload);

    // Get auth token - ensure userData.getToken is available
    let token;
    if (typeof userData.getToken === 'function') {
      token = await userData.getToken();
    } else {
      // Assume token is passed directly
      token = userData.token;
    }

    if (!token) {
      console.warn('No authentication token available for diet plan API call');
    }

    // Make the API call - ensure correct endpoint
    const response = await axios.post('http://localhost:3000/api/plans/generate-diet-plan', payload, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    
    console.log('Received diet plan response:', response.status);
    
    // Return the data
    return response.data;
  } catch (error) {
    console.error('Error fetching diet plan:', error);
    
    // Get more detailed error information
    let errorMessage = 'Failed to generate diet plan';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = `Server error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
      console.error('Error details:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please check your connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }
    
    // Throw a user-friendly error that can be displayed in the UI
    throw new Error(errorMessage);
  }
};

/**
 * Maps the user's primary goal to the API's expected format
 */
const mapGoalToApiFormat = (goal) => {
  if (!goal) return 'maintenance';
  
  switch (goal.toLowerCase()) {
    case 'lose_weight':
      return 'weight_loss';
    case 'gain_muscle':
      return 'muscle_gain';
    case 'maintain_weight':
      return 'maintenance';
    case 'improve_endurance':
      return 'performance';
    case 'general_wellness':
      return 'wellness';
    default:
      return 'maintenance';
  }
};

export default {
  fetchDietPlan
};