/* Transforms API response data into UI-friendly format
Contains helper functions for data formatting */

/**
 * Transforms the API diet plan data into a format suitable for the UI
 * @param {Object} apiData - Diet plan data from the API
 * @returns {Object} - Transformed diet plan data
 */
export const transformDietPlanData = (apiData) => {
  if (!apiData || !apiData.meal_plan) {
    return null;
  }

  const transformedData = {};
  
  apiData.meal_plan.forEach(day => {
    const dayKey = `day${day.day}`;
    
    // Keep track of original food strings by meal type
    const originalFoods = {};
    
    // Transform meals
    const meals = day.meals.map(meal => {
      // Generate descriptive meal name
      const mealName = generateMealName(meal);
      
      // Generate meal description
      const description = generateMealDescription(meal);
      
      // Calculate meal totals
      const mealTotals = calculateMealTotals(meal.foods);
      
      // Extract food items in a readable format
      const items = extractFoodItems(meal.foods);
      
      // Store original food strings for reference
      originalFoods[meal.meal_type] = meal.foods;
      
      return {
        type: capitalizeFirstLetter(meal.meal_type),
        time: meal.time,
        name: mealName,
        description: description,
        calories: Math.round(mealTotals.calories),
        protein: Math.round(mealTotals.protein),
        carbs: Math.round(mealTotals.carbs),
        fat: Math.round(mealTotals.fat),
        items: items
      };
    });
    
    transformedData[dayKey] = {
      title: `Day ${day.day}`,
      meals: meals,
      dailyTotals: day.daily_totals || calculateDailyTotals(meals),
      originalFoods: originalFoods // Add this to preserve original data
    };
  });
  
  return transformedData;
};
  
  /**
   * Generates a descriptive name for a meal based on its contents
   */
  const generateMealName = (meal) => {
    const foodNames = meal.foods.map(food => food.split(',')[0].trim());
    
    switch (meal.meal_type) {
      case 'breakfast':
        if (foodNames.some(name => name.includes('Oatmeal'))) {
          return 'Oatmeal Breakfast Bowl';
        } else if (foodNames.some(name => name.includes('Eggs'))) {
          return 'Protein-Rich Egg Breakfast';
        } else if (foodNames.some(name => name.includes('Pancake'))) {
          return 'Pancakes with Greek Yogurt';
        } else if (foodNames.some(name => name.includes('Toast'))) {
          return 'Whole Grain Toast Breakfast';
        }
        return 'Nutritious Breakfast';
        
      case 'lunch':
        if (foodNames.some(name => name.includes('Chicken'))) {
          return 'Grilled Chicken Lunch Bowl';
        } else if (foodNames.some(name => name.includes('Turkey'))) {
          return 'Lean Turkey Protein Bowl';
        } else if (foodNames.some(name => name.includes('Quinoa'))) {
          return 'Quinoa Power Bowl';
        } else if (foodNames.some(name => name.includes('Salad'))) {
          return 'Fresh Protein Salad';
        }
        return 'Balanced Lunch';
        
      case 'dinner':
        if (foodNames.some(name => name.includes('Salmon'))) {
          return 'Omega-Rich Salmon Dinner';
        } else if (foodNames.some(name => name.includes('Beef'))) {
          return 'Steak with Sweet Potato';
        } else if (foodNames.some(name => name.includes('Fish'))) {
          return 'Grilled Fish with Vegetables';
        }
        return 'Balanced Dinner Plate';
        
      case 'snack':
        if (foodNames.some(name => name.includes('Protein'))) {
          return 'Protein Boost Snack';
        } else if (foodNames.some(name => name.includes('Yogurt'))) {
          return 'Greek Yogurt with Berries';
        } else if (foodNames.some(name => name.includes('Cottage'))) {
          return 'Protein-Rich Cottage Cheese';
        } else if (foodNames.some(name => name.includes('Egg'))) {
          return 'High-Protein Egg Snack';
        }
        return 'Nutritious Snack';
        
      default:
        return 'Balanced Meal';
    }
  };
  
  /**
   * Generates a description for a meal based on its type and contents
   */
  const generateMealDescription = (meal) => {
    const foodNames = meal.foods.map(food => food.split(',')[0].trim());
    
    switch (meal.meal_type) {
      case 'breakfast':
        return 'A nutritious morning meal to kickstart your day with energy and focus';
      case 'lunch':
        return 'Balanced midday meal with protein and complex carbs to sustain energy levels';
      case 'dinner':
        return 'Wholesome evening meal with lean protein and vegetables for recovery and repair';
      case 'snack':
        return 'Strategic snack to maintain energy and support your fitness goals';
      default:
        return 'Balanced meal with optimal macronutrient distribution';
    }
  };
  
  /**
   * Calculates the nutritional totals for a meal based on its foods
   */
  const calculateMealTotals = (foods) => {
    return foods.reduce((totals, food) => {
      // Extract nutritional values using regex
      const calorieMatch = food.match(/(\d+(?:\.\d+)?)\s*cal/);
      const proteinMatch = food.match(/(\d+(?:\.\d+)?)g\s*protein/);
      const carbsMatch = food.match(/(\d+(?:\.\d+)?)g\s*carbs/);
      const fatsMatch = food.match(/(\d+(?:\.\d+)?)g\s*fats?/);
      
      if (calorieMatch) totals.calories += parseFloat(calorieMatch[1]);
      if (proteinMatch) totals.protein += parseFloat(proteinMatch[1]);
      if (carbsMatch) totals.carbs += parseFloat(carbsMatch[1]);
      if (fatsMatch) totals.fat += parseFloat(fatsMatch[1]);
      
      return totals;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };
  
  /**
   * Extracts food items in a readable format
   */
  const extractFoodItems = (foods) => {
    return foods.map(food => {
      // Just get the first part (the food name) before the comma and nutritional info
      const foodName = food.split(',')[0].trim();
      
      // Try to extract the amount if present
      const amountMatch = foodName.match(/([\d/]+\s*[a-zA-Z]+|[\d/]+)\s(.+)/);
      
      if (amountMatch) {
        return `${amountMatch[2]}, ${amountMatch[1]}`;
      }
      
      return foodName;
    });
  };
  
  /**
   * Calculates daily totals from meal data
   */
  const calculateDailyTotals = (meals) => {
    return meals.reduce((totals, meal) => {
      totals.calories += meal.calories;
      totals.protein += meal.protein;
      totals.carbs += meal.carbs;
      totals.fats += meal.fat;
      return totals;
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };
  
  /**
   * Capitalizes the first letter of a string
   */
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  export default {
    transformDietPlanData
  };