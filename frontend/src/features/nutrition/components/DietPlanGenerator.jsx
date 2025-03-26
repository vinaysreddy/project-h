/* Component that handles the diet plan generation process
Shows loading and error states */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchDietPlan } from '../services/nutritionService';

const DietPlanGenerator = ({ userData, healthMetrics, onDietPlanGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMadeAttempt, setHasMadeAttempt] = useState(false);

  // Prepare enhanced user data combining profile and health metrics
  const enhancedUserData = {
    ...userData,
    calorieTarget: healthMetrics.calorieTarget,
    macros: healthMetrics.macros,
  };

  // Function to generate diet plan 
  const generateDietPlan = async () => {
    setIsLoading(true);
    setError(null);
    setHasMadeAttempt(true);
    
    try {
      const dietPlanData = await fetchDietPlan(enhancedUserData);
      
      // Check if we have valid data
      if (!dietPlanData || !dietPlanData.meal_plan || dietPlanData.meal_plan.length === 0) {
        throw new Error('The diet plan was not generated correctly. Please try again.');
      }
      
      // Format the data for the app
      const formattedDietPlan = {};
      
      // Map the meal plan data to a format expected by the NutritionTab component
      dietPlanData.meal_plan.forEach((day, index) => {
        formattedDietPlan[`day${index + 1}`] = day;
      });
      
      // Pass the formatted diet plan back to the parent component
      onDietPlanGenerated(formattedDietPlan);
    } catch (error) {
      console.error('Failed to generate diet plan:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate on first load
  useEffect(() => {
    if (!hasMadeAttempt) {
      generateDietPlan();
    }
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="h-2 bg-[#3E7B27] w-full"></div>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <Utensils className="h-5 w-5 mr-2 text-[#3E7B27]" />
            Generating Your Nutrition Plan
          </CardTitle>
          <CardDescription>
            Creating a personalized meal plan based on your goals and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3E7B27] mb-6"></div>
          <p className="text-lg text-gray-700 mb-2">Building your personalized meal plan...</p>
          <p className="text-sm text-gray-500 max-w-md text-center">
            This may take a moment as we're tailoring meals to match your health goals, dietary preferences, and nutritional needs.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="h-2 bg-red-500 w-full"></div>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            Unable to Generate Meal Plan
          </CardTitle>
          <CardDescription>
            We encountered an issue while creating your nutrition plan
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 max-w-md text-center mb-6">
            This could be due to a connection issue or a problem with our service. Please try again.
          </p>
          
          <Button 
            onClick={generateDietPlan} 
            className="bg-[#3E7B27] hover:bg-[#2d5b1d]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // This state should not be visible since we auto-generate
  // but adding as a fallback
  return (
    <Card className="max-w-2xl mx-auto">
      <div className="h-2 bg-[#3E7B27] w-full"></div>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <Utensils className="h-5 w-5 mr-2 text-[#3E7B27]" />
          Generate Your Nutrition Plan
        </CardTitle>
        <CardDescription>
          Create a personalized meal plan based on your goals and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="py-8 text-center">
        <p className="mb-6 text-gray-600">
          Click the button below to generate a personalized meal plan tailored to your:
        </p>
        <ul className="text-left max-w-md mx-auto mb-6 space-y-2">
          <li className="flex items-start">
            <span className="text-[#3E7B27] mr-2">✓</span>
            <span>Daily calorie target of <strong>{healthMetrics.calorieTarget || 'calculated'} calories</strong></span>
          </li>
          <li className="flex items-start">
            <span className="text-[#3E7B27] mr-2">✓</span>
            <span>Macronutrient goals based on your fitness objectives</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#3E7B27] mr-2">✓</span>
            <span>Food preferences and dietary restrictions</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          onClick={generateDietPlan} 
          className="bg-[#3E7B27] hover:bg-[#2d5b1d]"
        >
          <Utensils className="h-4 w-4 mr-2" />
          Generate Meal Plan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DietPlanGenerator;