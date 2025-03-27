/* Main component that displays the nutrition information
Uses the diet plan data to render UI */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Apple, Utensils, Coffee, CircleEllipsis, Timer, Info, CheckCircle2, CalendarCheck, AlertCircle } from 'lucide-react';
import DietPlanGenerator from '@features/nutrition/components/DietPlanGenerator';
import { LightbulbIcon } from 'lucide-react';
import { CircleCheckBig } from 'lucide-react';
import DietQuestionnaire from './components/DietQuestionnaire';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { transformDietPlanData } from './utils/nutritionDataFormatter';
import { 
  getDietQuestionnaire,
  submitDietQuestionnaire,
  generateDietPlan,
  getDietPlan
} from './services/nutritionService';

const NutritionTab = ({ userData = {}, healthMetrics = {} }) => {
  const { currentUser, getToken } = useAuth();
  const [activeDay, setActiveDay] = useState('day1');
  const [dietPlan, setDietPlan] = useState(null);
  const [dietPreferences, setDietPreferences] = useState(null);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  
  // Destructure with default values to prevent errors
  const { 
    calorieTarget = 2000,
    macros = { protein: 30, carbs: 40, fat: 30 },
    tdee = 2200
  } = healthMetrics || {};
  
  // Check if user has existing diet preferences
  useEffect(() => {
    const checkDietPreferences = async () => {
      console.log("🔄 Starting diet preferences check flow...");
      try {
        setIsLoadingPreferences(true);
        
        // Get auth token
        const token = await getToken();
        console.log("✅ Authentication token obtained");
        
        if (!token) {
          console.error("❌ No auth token available");
          throw new Error('Authentication required');
        }
        
        // Fetch user's diet data using the service function
        console.log("🔄 Fetching user diet questionnaire data...");
        const response = await getDietQuestionnaire(token);
        console.log("📋 Diet questionnaire API response:", response);
        
        // If we have diet data, store it
        if (response && response.data) {
          console.log("✅ Diet preferences found in backend");
          setDietPreferences(response.data);
          setShowQuestionnaire(false);
          
          // Also fetch the existing diet plan if available
          try {
            console.log("🔄 Fetching existing diet plan...");
            const dietPlanResponse = await getDietPlan(token);
            console.log("📋 Diet plan response:", dietPlanResponse);
            
            if (dietPlanResponse && dietPlanResponse.meal_plan) {
              console.log("🔄 Transforming diet plan data...");
              const formattedDietPlan = transformDietPlanData(dietPlanResponse);
              console.log("📋 Formatted diet plan:", formattedDietPlan);
              setDietPlan(formattedDietPlan);
            }
          } catch (planError) {
            console.log("⚠️ No existing diet plan or error fetching it", planError);
          }
        } else {
          console.log("ℹ️ No diet preferences found, showing questionnaire");
          setShowQuestionnaire(true);
        }
      } catch (error) {
        console.error("❌ Error checking diet preferences:", error);
        setShowQuestionnaire(true);
      } finally {
        setIsLoadingPreferences(false);
      }
    };
    
    if (currentUser) {
      checkDietPreferences();
    }
  }, [currentUser, getToken]);
  
  // Update handleDietPreferencesSubmit function
  const handleDietPreferencesSubmit = async (preferencesData) => {
    try {
      setSubmissionError(null);
      setIsLoadingPreferences(true);
      
      // Get auth token
      const token = await getToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      console.log('Submitting diet preferences to backend:', preferencesData);
      
      const completeData = {
        ...preferencesData,  // All the questionnaire data
        // Add required fields with proper names
        calories: healthMetrics.calorieTarget,
        protein: healthMetrics.macros?.protein || 0,
        carbs: healthMetrics.macros?.carbs || 0,
        fats: healthMetrics.macros?.fat || 0,
        diet_type: preferencesData.dietType,
        meals_per_day: preferencesData.mealsPerDay,
        food_restrictions: preferencesData.foodRestrictions,
        allergies: preferencesData.allergies
      };
      
      // 1. Submit diet questionnaire
      const questionnaireResponse = await submitDietQuestionnaire(completeData, token);
      console.log('Diet questionnaire submission response:', questionnaireResponse);
      
      // 2. Generate diet plan - no need to send all the data again, backend will use stored questionnaire
      const dietPlanResponse = await generateDietPlan({}, token);
      console.log('Diet plan generation response:', dietPlanResponse);
      
      // 3. Get the generated plan
      const planResponse = await getDietPlan(token);
      console.log('Diet plan retrieval response:', planResponse);
      
      // Format the data using the utility function
      if (planResponse && planResponse.meal_plan) {
        const formattedDietPlan = transformDietPlanData(planResponse);
        setDietPlan(formattedDietPlan);
      }
      
      // Update preferences state and hide questionnaire
      setDietPreferences(completeData);
      setShowQuestionnaire(false);
    } catch (error) {
      console.error('Error in diet workflow:', error);
      let errorMessage = 'Failed to process your diet preferences. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      setSubmissionError(errorMessage);
    } finally {
      setIsLoadingPreferences(false);
    }
  };
  
  // Handle diet plan generated from the DietPlanGenerator
  const handleDietPlanGenerated = async (generatedPlan) => {
    try {
      // Get auth token
      const token = typeof getToken === 'function' 
        ? await getToken() 
        : await currentUser?.getIdToken(true);
        
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Save the generated plan to the backend using service function
      await generateDietPlan({
        plan: generatedPlan,
        dietPreferences: dietPreferences
      }, token);
      
      // Update local state
      setDietPlan(generatedPlan);
    } catch (error) {
      console.error('Error saving generated diet plan:', error);
    }
  };
  
  // Retry submitting the questionnaire
  const retrySubmission = () => {
    setSubmissionError(null);
    setShowQuestionnaire(true);
  };
  
  // Loading state while checking preferences
  if (isLoadingPreferences) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3E7B27]"></div>
          <p className="mt-4 text-sm text-gray-500">Loading nutrition data...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (submissionError) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="h-2 bg-red-500 w-full"></div>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            Unable to Save Diet Preferences
          </CardTitle>
          <CardDescription>
            We encountered an issue while saving your preferences
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
                  {submissionError}
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 max-w-md text-center mb-6">
            This could be due to a connection issue or a problem with our service. Please try again.
          </p>
          
          <Button 
            onClick={retrySubmission} 
            className="bg-[#3E7B27] hover:bg-[#2d5b1d]"
          >
            <Apple className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Show questionnaire if needed
  if (showQuestionnaire) {
    return <DietQuestionnaire 
      userData={userData} 
      healthMetrics={healthMetrics} 
      onSubmit={handleDietPreferencesSubmit} 
    />;
  }
  
  // If we have preferences but no diet plan yet, show the generator
  if (dietPreferences && !dietPlan) {
    return <DietPlanGenerator 
      userData={{
        ...userData,
        dietPreference: dietPreferences.dietType,
        foodRestrictions: dietPreferences.foodRestrictions,
        allergies: dietPreferences.allergies
      }} 
      healthMetrics={healthMetrics} 
      onDietPlanGenerated={handleDietPlanGenerated} 
    />;
  }
  
  // If no diet plan yet, show the generator
  if (!dietPlan) {
    return <DietPlanGenerator userData={userData} healthMetrics={healthMetrics} onDietPlanGenerated={handleDietPlanGenerated} />;
  }
  
  // Get the active day plan
  const activeDayPlan = dietPlan[activeDay] || dietPlan.day1;
  
  // Calculate daily totals if not provided
  const dailyTotals = activeDayPlan.dailyTotals || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };
  
  // Calculate percentage of target
  const caloriePercentage = Math.round((dailyTotals.calories / calorieTarget) * 100);
  
  return (
    <div className="space-y-8">
      {/* Nutrition Summary Card */}
      <Card className="overflow-hidden">
        <div className="h-2 bg-[#3E7B27] w-full"></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-bold flex items-center">
                <Apple className="h-5 w-5 mr-2 text-[#3E7B27]" />
                Nutrition Overview
              </CardTitle>
              <CardDescription>
                Daily nutrition targets based on your goals
              </CardDescription>
            </div>
            <Badge className="bg-[#3E7B27]">Active Plan</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Daily Target</span>
                <span className="font-bold">{calorieTarget} calories</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Maintenance</span>
                <span>{tdee} calories</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Today's Plan</span>
                <span>{dailyTotals.calories} calories</span>
              </div>
              <Progress value={caloriePercentage} className="h-2 mt-2">
                <div className="h-full bg-[#3E7B27] rounded-full"></div>
              </Progress>
              <p className="text-xs text-right text-muted-foreground">
                {caloriePercentage}% of daily target
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium mb-1">Macronutrient Targets</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 bg-blue-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Protein</p>
                  <p className="font-bold">{macros.protein}%</p>
                  <p className="text-xs">{Math.round(dailyTotals.protein || 0)}g</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Carbs</p>
                  <p className="font-bold">{macros.carbs}%</p>
                  <p className="text-xs">{Math.round(dailyTotals.carbs || 0)}g</p>
                </div>
                <div className="p-2 bg-yellow-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Fat</p>
                  <p className="font-bold">{macros.fat}%</p>
                  <p className="text-xs">{Math.round(dailyTotals.fat || dailyTotals.fats || 0)}g</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Info className="h-3 w-3" />
                <span>Based on your weight and activity level</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Nutritional Breakdown Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center">
            <CalendarCheck className="h-5 w-5 mr-2 text-[#3E7B27]" />
            Daily Nutritional Breakdown
          </CardTitle>
          <CardDescription>
            Complete macronutrient analysis for {dietPlan[activeDay].title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-right font-medium">% of Total</th>
                  <th className="px-4 py-3 text-right font-medium">Target</th>
                  <th className="px-4 py-3 text-right font-medium">% of Target</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3">Calories</td>
                  <td className="px-4 py-3 text-right font-medium">{dailyTotals.calories} cal</td>
                  <td className="px-4 py-3 text-right">100%</td>
                  <td className="px-4 py-3 text-right">{calorieTarget} cal</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${dailyTotals.calories > calorieTarget * 1.05 ? 'bg-red-100 text-red-800' : dailyTotals.calories < calorieTarget * 0.95 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {Math.round((dailyTotals.calories / calorieTarget) * 100)}%
                    </span>
                  </td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-4 py-3">Protein</td>
                  <td className="px-4 py-3 text-right font-medium">{Math.round(dailyTotals.protein)}g</td>
                  <td className="px-4 py-3 text-right">{Math.round((dailyTotals.protein * 4 / dailyTotals.calories) * 100)}%</td>
                  <td className="px-4 py-3 text-right">{Math.round(calorieTarget * macros.protein / 100 / 4)}g</td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {Math.round((dailyTotals.protein / (calorieTarget * macros.protein / 100 / 4)) * 100)}%
                    </span>
                  </td>
                </tr>
                <tr className="bg-green-50">
                  <td className="px-4 py-3">Carbohydrates</td>
                  <td className="px-4 py-3 text-right font-medium">{Math.round(dailyTotals.carbs)}g</td>
                  <td className="px-4 py-3 text-right">{Math.round((dailyTotals.carbs * 4 / dailyTotals.calories) * 100)}%</td>
                  <td className="px-4 py-3 text-right">{Math.round(calorieTarget * macros.carbs / 100 / 4)}g</td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      {Math.round((dailyTotals.carbs / (calorieTarget * macros.carbs / 100 / 4)) * 100)}%
                    </span>
                  </td>
                </tr>
                <tr className="bg-yellow-50">
                  <td className="px-4 py-3">Fat</td>
                  <td className="px-4 py-3 text-right font-medium">{Math.round(dailyTotals.fat || dailyTotals.fats)}g</td>
                  <td className="px-4 py-3 text-right">{Math.round(((dailyTotals.fat || dailyTotals.fats) * 9 / dailyTotals.calories) * 100)}%</td>
                  <td className="px-4 py-3 text-right">{Math.round(calorieTarget * macros.fat / 100 / 9)}g</td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      {Math.round(((dailyTotals.fat || dailyTotals.fats) / (calorieTarget * macros.fat / 100 / 9)) * 100)}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-xs text-muted-foreground mt-3">
            <Info className="h-3 w-3 inline mr-1" />
            Protein & carbs contain 4 calories per gram, while fat contains 9 calories per gram
          </div>
        </CardContent>
      </Card>
      
      {/* Meal Plan Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold flex items-center">
              <Utensils className="h-5 w-5 mr-2 text-[#3E7B27]" />
              Your Meal Plan
            </CardTitle>
            <div className="flex space-x-1">
              <TabsList className="bg-gray-100 p-1 rounded-md">
                {Object.keys(dietPlan).map((day) => (
                  <TabsTrigger 
                    key={day}
                    value={day} 
                    onClick={() => setActiveDay(day)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      activeDay === day ? 'bg-white shadow-sm' : ''
                    }`}
                  >
                    {dietPlan[day].title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
          <CardDescription className="pt-2">
            {Object.keys(dietPlan).length}-day meal plan designed to meet your calorie and macronutrient targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activeDayPlan.meals.map((meal, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
                  <div className="flex items-center">
                    {meal.type === "Breakfast" && <Coffee className="h-4 w-4 mr-2 text-orange-500" />}
                    {meal.type === "Lunch" && <Utensils className="h-4 w-4 mr-2 text-blue-500" />}
                    {meal.type === "Dinner" && <Utensils className="h-4 w-4 mr-2 text-purple-500" />}
                    {meal.type === "Snack" && <Apple className="h-4 w-4 mr-2 text-green-500" />}
                    <span className="font-medium">{meal.type}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Timer className="h-3 w-3 mr-1" />
                    <span>{meal.time}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">{meal.name}</h4>
                    <Badge variant="outline" className="bg-[#3E7B27] bg-opacity-10 text-[#3E7B27] border-[#3E7B27] border-opacity-20">
                      {meal.calories} cal
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{meal.description}</p>
                  
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center text-xs p-1 bg-blue-50 rounded">
                      <span className="block text-gray-500">Protein</span>
                      <span className="font-bold">{meal.protein}g</span>
                    </div>
                    <div className="text-center text-xs p-1 bg-green-50 rounded">
                      <span className="block text-gray-500">Carbs</span>
                      <span className="font-bold">{meal.carbs}g</span>
                    </div>
                    <div className="text-center text-xs p-1 bg-yellow-50 rounded">
                      <span className="block text-gray-500">Fat</span>
                      <span className="font-bold">{meal.fat}g</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h5 className="text-xs font-medium mb-2">Meal Items:</h5>
                    <div className="space-y-2">
                      {meal.items.map((item, i) => {
                        // Get the original food string from the raw data for more info
                        const foodString = activeDayPlan.originalFoods?.[meal.type.toLowerCase()]?.[i] || '';
                        
                        // Extract nutritional information using regex
                        const calorieMatch = foodString.match(/(\d+(?:\.\d+)?)\s*cal/);
                        const proteinMatch = foodString.match(/(\d+(?:\.\d+)?)g\s*protein/);
                        const carbsMatch = foodString.match(/(\d+(?:\.\d+)?)g\s*carbs/);
                        const fatsMatch = foodString.match(/(\d+(?:\.\d+)?)g\s*fats?/);
                        
                        // Get values or default to empty string
                        const calories = calorieMatch ? calorieMatch[1] : '';
                        const protein = proteinMatch ? proteinMatch[1] : '';
                        const carbs = carbsMatch ? carbsMatch[1] : '';
                        const fats = fatsMatch ? fatsMatch[1] : '';
                        
                        return (
                          <div key={i} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                            <div className="flex items-start">
                              <CheckCircle2 className="h-3 w-3 mr-1 text-green-500 mt-1 shrink-0" />
                              <div className="flex-1">
                                <div className="flex flex-wrap justify-between items-start">
                                  <span className="text-xs font-medium">{item}</span>
                                  {calories && (
                                    <span className="text-xs text-gray-500 ml-2">{calories} cal</span>
                                  )}
                                </div>
                                
                                {(protein || carbs || fats) && (
                                  <div className="mt-1 flex space-x-3 text-[10px] text-gray-500">
                                    {protein && (
                                      <span className="bg-blue-50 px-1 py-0.5 rounded">
                                        Protein: {protein}g
                                      </span>
                                    )}
                                    {carbs && (
                                      <span className="bg-green-50 px-1 py-0.5 rounded">
                                        Carbs: {carbs}g
                                      </span>
                                    )}
                                    {fats && (
                                      <span className="bg-yellow-50 px-1 py-0.5 rounded">
                                        Fat: {fats}g
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Meal Summary Table */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <h5 className="text-xs font-medium mb-2">Meal Summary:</h5>
                    <div className="overflow-hidden bg-gray-50 rounded-md">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="p-2 text-left">Meal Total</th>
                            <th className="p-2 text-right">Calories</th>
                            <th className="p-2 text-right">Protein</th>
                            <th className="p-2 text-right">Carbs</th>
                            <th className="p-2 text-right">Fat</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2 text-left font-medium">Amount</td>
                            <td className="p-2 text-right">{meal.calories} cal</td>
                            <td className="p-2 text-right">{meal.protein}g</td>
                            <td className="p-2 text-right">{meal.carbs}g</td>
                            <td className="p-2 text-right">{meal.fat}g</td>
                          </tr>
                          <tr className="bg-gray-100">
                            <td className="p-2 text-left font-medium">% of Daily</td>
                            <td className="p-2 text-right">{Math.round((meal.calories / dailyTotals.calories) * 100)}%</td>
                            <td className="p-2 text-right">{Math.round((meal.protein / dailyTotals.protein) * 100)}%</td>
                            <td className="p-2 text-right">{Math.round((meal.carbs / dailyTotals.carbs) * 100)}%</td>
                            <td className="p-2 text-right">{Math.round((meal.fat / (dailyTotals.fat || dailyTotals.fats)) * 100)}%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            <CircleEllipsis className="h-4 w-4 inline mr-1" />
            Adjust your meals as needed based on preferences and availability
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NutritionTab;