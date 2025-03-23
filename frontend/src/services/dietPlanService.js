/* Handles API calls to fetch diet plans
Contains mock data for development */

import axios from 'axios';

/**
 * Fetches a diet plan from the API
 * @param {Object} userData - User data and preferences
 * @returns {Promise<Object>} - The diet plan data
 */
export const fetchDietPlan = async (userData) => {
  try {
    // Prepare the request payload
    const payload = {
      calories: userData.calorieTarget || 2200,
      protein: userData.macros?.protein * 10 || 180, // Convert percentage to grams (approx)
      carbs: userData.macros?.carbs * 10 || 220,     // Convert percentage to grams (approx)
      fats: userData.macros?.fat * 10 || 70,         // Convert percentage to grams (approx)
      meals_per_day: 4, // Default to 4 meals (breakfast, lunch, dinner, snack)
      diet_type: userData.dietType || "non-veg",
      food_restrictions: userData.foodRestrictions || [],
      allergies: userData.allergies || [],
      goal: mapGoalToApiFormat(userData.primaryGoal)
    };

    // Make the API call
    const response = await axios.post('http://localhost:3000/api/generate-diet', payload);
    
    // Return the data
    return response.data;
  } catch (error) {
    console.error('Error fetching diet plan:', error);
    // For development, return mock data when API fails
    return getMockDietPlanData();
  }
};

/**
 * Maps the user's primary goal to the API's expected format
 */
const mapGoalToApiFormat = (goal) => {
  switch (goal?.toLowerCase()) {
    case 'lose weight':
    case 'fat loss':
      return 'weight_loss';
    case 'build muscle':
      return 'muscle_gain';
    case 'maintain':
    case 'maintain weight':
      return 'maintenance';
    case 'improve fitness':
      return 'performance';
    default:
      return 'maintenance';
  }
};

/**
 * Mock data to use during development or when the API fails
 */
export const getMockDietPlanData = () => {
  return {
    "meal_plan": [
      {
        "day": 1,
        "meals": [
          {
            "meal_type": "breakfast",
            "time": "8:00 AM",
            "foods": [
              "Oatmeal, 1 cup, 154 cal, 6g protein, 27g carbs, 3g fats",
              "Eggs, 2 large, 143 cal, 12g protein, 1g carbs, 10g fats",
              "Banana, 1 medium, 105 cal, 1g protein, 27g carbs, 0.3g fats",
              "Almond milk, 1 cup, 58 cal, 1g protein, 8g carbs, 2.5g fats"
            ]
          },
          {
            "meal_type": "lunch",
            "time": "12:00 PM",
            "foods": [
              "Grilled chicken breast, 150g, 248 cal, 46g protein, 0g carbs, 5g fats",
              "Brown rice, 1 cup, 216 cal, 5g protein, 45g carbs, 1.5g fats",
              "Steamed broccoli, 1 cup, 55 cal, 4.7g protein, 11.2g carbs, 0.6g fats"
            ]
          },
          {
            "meal_type": "snack",
            "time": "4:00 PM",
            "foods": [
              "Protein shake, 1 scoop, 120 cal, 24g protein, 3g carbs, 1g fats",
              "Apple, 1 medium, 95 cal, 0.5g protein, 25g carbs, 0.3g fats",
              "Almonds, 15g, 87 cal, 3g protein, 3g carbs, 7g fats"
            ]
          },
          {
            "meal_type": "dinner",
            "time": "8:00 PM",
            "foods": [
              "Salmon, 150g, 280 cal, 39g protein, 0g carbs, 13g fats",
              "Quinoa, 1 cup, 222 cal, 8g protein, 39g carbs, 3.5g fats",
              "Mixed salad, 1 serving, 158 cal, 3g protein, 20g carbs, 8g fats"
            ]
          }
        ],
        "daily_totals": {
          "calories": 2199,
          "protein": 181.2,
          "carbs": 221.2,
          "fats": 70.2
        }
      },
      {
        "day": 2,
        "meals": [
          {
            "meal_type": "breakfast",
            "time": "8:00 AM",
            "foods": [
              "Whole grain toast, 2 slices, 138 cal, 6g protein, 24g carbs, 2g fats",
              "Scrambled eggs, 2 large, 182 cal, 12g protein, 2g carbs, 14g fats",
              "Orange juice, 1 cup, 112 cal, 2g protein, 26g carbs, 0.5g fats"
            ]
          },
          {
            "meal_type": "lunch",
            "time": "12:00 PM",
            "foods": [
              "Turkey breast, 150g, 165 cal, 39g protein, 0g carbs, 1g fats",
              "Quinoa salad, 1 cup, 222 cal, 8g protein, 39g carbs, 3.5g fats",
              "Avocado, 1/2 medium, 120 cal, 1.5g protein, 6g carbs, 11g fats"
            ]
          },
          {
            "meal_type": "snack",
            "time": "4:00 PM",
            "foods": [
              "Cottage cheese, 1 cup, 206 cal, 28g protein, 6g carbs, 10g fats",
              "Strawberries, 1 cup, 49 cal, 1g protein, 12g carbs, 0.5g fats"
            ]
          },
          {
            "meal_type": "dinner",
            "time": "8:00 PM",
            "foods": [
              "Beef steak, 150g, 271 cal, 31g protein, 0g carbs, 17g fats",
              "Sweet potato, 1 medium, 112 cal, 2g protein, 26g carbs, 0.1g fats",
              "Green beans, 1 cup, 44 cal, 2g protein, 10g carbs, 0.2g fats"
            ]
          }
        ],
        "daily_totals": {
          "calories": 2200,
          "protein": 182.5,
          "carbs": 219,
          "fats": 70.8
        }
      },
      {
        "day": 3,
        "meals": [
          {
            "meal_type": "breakfast",
            "time": "8:00 AM",
            "foods": [
              "Pancakes, 3 small, 182 cal, 6g protein, 32g carbs, 5g fats",
              "Greek yogurt, 1 cup, 140 cal, 20g protein, 8g carbs, 0g fats",
              "Mixed berries, 1/2 cup, 42 cal, 0.5g protein, 10.5g carbs, 0.2g fats"
            ]
          },
          {
            "meal_type": "lunch",
            "time": "12:00 PM",
            "foods": [
              "Grilled chicken wrap, 1 serving, 290 cal, 25g protein, 30g carbs, 10g fats",
              "Spinach salad, 1 serving, 90 cal, 3g protein, 10g carbs, 3g fats",
              "Hummus, 2 tbsp, 70 cal, 2g protein, 6g carbs, 4g fats"
            ]
          },
          {
            "meal_type": "snack",
            "time": "4:00 PM",
            "foods": [
              "Hard-boiled eggs, 2 large, 156 cal, 12g protein, 1g carbs, 11g fats",
              "Carrot sticks, 1 cup, 50 cal, 1g protein, 12g carbs, 0.3g fats"
            ]
          },
          {
            "meal_type": "dinner",
            "time": "8:00 PM",
            "foods": [
              "Grilled fish, 150g, 232 cal, 41g protein, 0g carbs, 8g fats",
              "Brown rice, 1 cup, 216 cal, 5g protein, 45g carbs, 1.5g fats",
              "Steamed asparagus, 1 cup, 27 cal, 3g protein, 5g carbs, 0.3g fats"
            ]
          }
        ],
        "daily_totals": {
          "calories": 2199,
          "protein": 180.5,
          "carbs": 220.5,
          "fats": 70.3
        }
      }
    ]
  };
};

export default {
  fetchDietPlan,
  getMockDietPlanData
};