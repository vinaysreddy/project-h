import React, { useState, useEffect } from 'react';
import * as calculations from '@/utils/calculations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, ArrowDownRight, Dumbbell, Flame, Heart, Apple, Moon, Droplets } from 'lucide-react';

const Dashboard = ({ formData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [projectedWeightData, setProjectedWeightData] = useState([]);

  // Calculate all metrics using imported calculation functions
  const bmi = calculations.calculateBMI(
    formData.height, 
    formData.weight, 
    formData.heightUnit,
    formData.weightUnit
  );
  
  const bmr = calculations.calculateBMR(
    formData.height,
    formData.weight,
    formData.gender,
    formData.dateOfBirth,
    formData.heightUnit,
    formData.weightUnit
  );
  
  const tdee = calculations.calculateTDEE(bmr, formData.activityLevel);
  const calorieTarget = calculations.calculateCalorieTarget(tdee, formData.primaryGoal);
  const macros = calculations.calculateMacros(calorieTarget, formData.primaryGoal);
  const waterIntake = calculations.calculateWaterIntake(formData.weight, formData.weightUnit, formData.activityLevel);
  const healthyWeightRange = calculations.calculateHealthyWeightRange(formData.height, formData.heightUnit);
  const successProbability = calculations.calculateSuccessProbability(formData);
  const cardioZones = calculations.calculateCardioZones(formData.dateOfBirth);
  const sleepRecommendation = calculations.calculateSleepRecommendation(formData.dateOfBirth, formData.activityLevel);
  const workoutRecommendation = calculations.getWorkoutRecommendation(formData.primaryGoal, formData.weeklyExercise, formData.healthConditions);
  
  // Generate projected weight data for chart
  useEffect(() => {
    if (formData.targetWeight) {
      const weightData = calculations.generateWeightProjection(
        formData.weight,
        formData.targetWeight,
        formData.primaryGoal,
        formData.weightUnit
      );
      setProjectedWeightData(weightData);
    }
  }, [formData]);

  // Prepare data for macros pie chart
  const macroData = [
    { name: 'Protein', value: macros.protein * 4, color: '#3b82f6' },
    { name: 'Carbs', value: macros.carbs * 4, color: '#10b981' },
    { name: 'Fat', value: macros.fat * 9, color: '#f59e0b' }
  ];

  // Get BMI category and color
  const { category: bmiCategory, color: bmiColor } = calculations.getBMICategory(bmi);

  // Calculate progress to goal weight if applicable
  const weightProgress = formData.targetWeight ? 
    calculations.calculateWeightProgress(formData.weight, formData.targetWeight) : null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-center">Your Personalized Health Dashboard</h1>
      <p className="text-center text-gray-500 mb-8">Based on your profile and goals</p>
      
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="fitness">Fitness</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* Welcome Card */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardTitle>Welcome to Your Health Journey</CardTitle>
              <CardDescription className="text-blue-100">
                Your primary goal: {formData.primaryGoal}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Key Stats */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <Flame className="h-5 w-5 mr-2 text-orange-500" />
                    Daily Energy
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Calories to consume:</span>
                      <span className="font-bold">{calorieTarget} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Calories burned (TDEE):</span>
                      <span className="font-medium">{tdee} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Basal rate (BMR):</span>
                      <span className="font-medium">{bmr} kcal</span>
                    </div>
                  </div>
                </div>

                {/* Success Factors */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <ArrowUpRight className="h-5 w-5 mr-2 text-green-500" />
                    Success Probability
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Goal alignment</span>
                        <span className="font-medium">{successProbability}%</span>
                      </div>
                      <Progress value={successProbability} className="h-2" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Your goal is {successProbability >= 70 ? 'well' : 'somewhat'} aligned with your profile. 
                      {successProbability < 70 && ' Consider adjusting your timeline or expectations.'}
                    </p>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <Dumbbell className="h-5 w-5 mr-2 text-purple-500" />
                    Get Started
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                      <span>Track your daily food intake to meet your calorie target</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                      <span>Complete {workoutRecommendation.frequency} workouts per week</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                      <span>Log your wearable data to get more personalized insights</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* BMI Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Body Mass Index (BMI)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold">{bmi}</span>
                  <Badge className={`px-3 py-1 ${bmiColor}`}>{bmiCategory}</Badge>
                </div>
                <div className="mt-4">
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-3 ${bmiColor}`} 
                      style={{ width: `${Math.min(100, (bmi / 40) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-600">
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obese</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Healthy weight range: {healthyWeightRange.min}-{healthyWeightRange.max} 
                  {formData.weightUnit}
                </p>
              </CardContent>
            </Card>

            {/* Water & Sleep Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Daily Wellness</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="font-medium">Water Intake Target</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold mr-2">{waterIntake.amount}</span>
                    <span className="text-gray-600">{waterIntake.unit}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Based on your body weight and activity level
                  </p>
                </div>
                <div className="pt-2">
                  <div className="flex items-center mb-2">
                    <Moon className="h-5 w-5 mr-2 text-indigo-500" />
                    <span className="font-medium">Sleep Recommendation</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold mr-2">{sleepRecommendation}</span>
                    <span className="text-gray-600">hours</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Optimal for recovery and performance
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Workout Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recommended Training</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Dumbbell className="h-5 w-5 mr-2 text-purple-500" />
                    <span className="font-medium">Workout Focus</span>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                    {workoutRecommendation.focus}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    <span className="font-medium">Frequency</span>
                  </div>
                  <p>{workoutRecommendation.frequency}</p>
                </div>
                <p className="text-sm text-gray-600">
                  {workoutRecommendation.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* NUTRITION TAB */}
        <TabsContent value="nutrition" className="space-y-6">
          {/* Calorie Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Nutrition Plan</CardTitle>
              <CardDescription>
                Optimized for {formData.primaryGoal.toLowerCase().replace(/[^\w\s]/gi, '')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Flame className="h-4 w-4 mr-2 text-orange-500" />
                    Calorie Balance
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daily calorie target:</span>
                      <span className="font-bold">{calorieTarget} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Maintenance calories:</span>
                      <span>{tdee} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daily deficit/surplus:</span>
                      <span className={calorieTarget > tdee ? "text-green-600" : "text-red-600"}>
                        {calorieTarget > tdee ? "+" : ""}{calorieTarget - tdee} kcal
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weekly deficit/surplus:</span>
                      <span className={calorieTarget > tdee ? "text-green-600" : "text-red-600"}>
                        {calorieTarget > tdee ? "+" : ""}{(calorieTarget - tdee) * 7} kcal
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Apple className="h-4 w-4 mr-2 text-green-500" />
                    Macronutrient Distribution
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {macroData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} calories`, 'Calories']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold mb-4">Daily Targets Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Protein</span>
                      <span className="font-medium">{macros.protein}g</span>
                    </div>
                    <Progress value={100} className="h-2 bg-blue-100">
                      <div className="h-full bg-blue-600 rounded-full"></div>
                    </Progress>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(macros.protein * 4)} calories ({Math.round((macros.protein * 4 / calorieTarget) * 100)}%)
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Carbohydrates</span>
                      <span className="font-medium">{macros.carbs}g</span>
                    </div>
                    <Progress value={100} className="h-2 bg-green-100">
                      <div className="h-full bg-green-600 rounded-full"></div>
                    </Progress>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(macros.carbs * 4)} calories ({Math.round((macros.carbs * 4 / calorieTarget) * 100)}%)
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Fat</span>
                      <span className="font-medium">{macros.fat}g</span>
                    </div>
                    <Progress value={100} className="h-2 bg-yellow-100">
                      <div className="h-full bg-yellow-600 rounded-full"></div>
                    </Progress>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(macros.fat * 9)} calories ({Math.round((macros.fat * 9 / calorieTarget) * 100)}%)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-blue-50 text-blue-800 text-sm">
              <p>
                These macronutrient targets are optimized for {formData.primaryGoal.toLowerCase().replace(/[^\w\s]/gi, '')}. 
                Adjust your meal planning to meet these targets for optimal results.
              </p>
            </CardFooter>
          </Card>

          {/* Meal Planning Card */}
          <Card>
            <CardHeader>
              <CardTitle>Meal Planning Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Based on your calorie target of {calorieTarget} kcal, here's a suggested meal structure:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="pb-2 border-b">
                      <div className="flex justify-between">
                        <span className="font-medium">Breakfast (25%)</span>
                        <span>{Math.round(calorieTarget * 0.25)} kcal</span>
                      </div>
                    </div>
                    <div className="pb-2 border-b">
                      <div className="flex justify-between">
                        <span className="font-medium">Lunch (30%)</span>
                        <span>{Math.round(calorieTarget * 0.3)} kcal</span>
                      </div>
                    </div>
                    <div className="pb-2 border-b">
                      <div className="flex justify-between">
                        <span className="font-medium">Dinner (30%)</span>
                        <span>{Math.round(calorieTarget * 0.3)} kcal</span>
                      </div>
                    </div>
                    <div className="pb-2 border-b">
                      <div className="flex justify-between">
                        <span className="font-medium">Snacks (15%)</span>
                        <span>{Math.round(calorieTarget * 0.15)} kcal</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Meal Timing Tips</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                      <li>Eat protein with every meal to improve satiety and muscle recovery</li>
                      <li>Space meals 3-4 hours apart to maintain steady energy levels</li>
                      <li>Consider timing carbs around your workouts for optimal performance</li>
                      <li>Stay hydrated by drinking {waterIntake.amount} {waterIntake.unit} throughout the day</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FITNESS TAB */}
        <TabsContent value="fitness" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Training Blueprint</CardTitle>
              <CardDescription>
                Personalized for your {formData.primaryGoal.toLowerCase().replace(/[^\w\s]/gi, '')} goal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Recommended Workout Split</h3>
                  <div className="space-y-3">
                    {workoutRecommendation.workoutPlan.map((day, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium">Day {index + 1}: {day.focus}</div>
                        <div className="text-sm text-gray-600 mt-1">{day.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Training Parameters</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between pb-2 border-b">
                        <span className="text-gray-600">Frequency:</span>
                        <span className="font-medium">{workoutRecommendation.frequency}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b">
                        <span className="text-gray-600">Focus:</span>
                        <span className="font-medium">{workoutRecommendation.focus}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b">
                        <span className="text-gray-600">Intensity:</span>
                        <span className="font-medium">{workoutRecommendation.intensity}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b">
                        <span className="text-gray-600">Rest between sets:</span>
                        <span className="font-medium">{workoutRecommendation.restPeriods}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Heart Rate Zones</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Recovery (50-60%):</span>
                        <span className="font-medium">{cardioZones.recovery} bpm</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-green-300 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Fat Burning (60-70%):</span>
                        <span className="font-medium">{cardioZones.fatBurning} bpm</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-blue-300 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Aerobic (70-80%):</span>
                        <span className="font-medium">{cardioZones.aerobic} bpm</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-yellow-300 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Anaerobic (80-90%):</span>
                        <span className="font-medium">{cardioZones.anaerobic} bpm</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-orange-400 rounded-full" style={{ width: '55%' }}></div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Maximum (90-100%):</span>
                        <span className="font-medium">{cardioZones.maximum} bpm</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-red-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-purple-50 text-purple-800 text-sm">
              <p>
                Connect your wearable device (Apple Watch, Whoop, Garmin, etc.) to get real-time 
                adjustments to your training plan based on your recovery and readiness.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* PROGRESS TAB */}
        <TabsContent value="progress" className="space-y-6">
          {formData.targetWeight && (
            <Card>
              <CardHeader>
                <CardTitle>Weight Progress Projection</CardTitle>
                <CardDescription>
                  Based on your target of {formData.targetWeight} {formData.weightUnit}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projectedWeightData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" label={{ value: 'Weeks', position: 'insideBottomRight', offset: -10 }} />
                      <YAxis label={{ value: `Weight (${formData.weightUnit})`, angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {weightProgress && (
                  <div className="mt-6">
                    <div className="flex justify-between mb-2">
                      <span>Current: {formData.weight} {formData.weightUnit}</span>
                      <span>Target: {formData.targetWeight} {formData.weightUnit}</span>
                    </div>
                    <Progress value={weightProgress.percentage} className="h-2.5" />
                    <div className="flex justify-between text-sm mt-1">
                      <span>0%</span>
                      <span className="text-blue-600 font-medium">{weightProgress.percentage}% complete</span>
                      <span>100%</span>
                    </div>
                    <div className="mt-4 text-center">
                      <span className="text-gray-600">
                        {weightProgress.remaining} {formData.weightUnit} {weightProgress.direction} at {weightProgress.rate} {formData.weightUnit}/week
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-blue-50 text-blue-800 text-sm">
                <p>
                  This projection is based on a healthy and sustainable rate of change. Your actual progress
                  may vary based on consistency, metabolism, and other factors.
                </p>
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="mb-4">Connect your wearable to enable automatic progress tracking</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
                    Connect Wearable
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <p className="mb-4 text-lg">We're developing the full mobile app with wearable integration.</p>
        <button className="bg-green-600 text-white px-6 py-2 rounded font-medium">
          Join Waitlist for Mobile App
        </button>
      </div>
    </div>
  );
};

export default Dashboard;