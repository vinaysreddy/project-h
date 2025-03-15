import React from 'react';
import * as calculations from '@/utils/calculations';

const Dashboard = ({ formData }) => {
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Personalized Health Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Key Metrics</h2>
          <div className="space-y-4">
            <div>
              <span className="font-medium">BMI:</span> {bmi}
              <div className="text-sm text-gray-500">
                {bmi < 18.5 ? "Underweight" : 
                 bmi < 25 ? "Healthy Weight" :
                 bmi < 30 ? "Overweight" : "Obese"}
              </div>
            </div>
            <div>
              <span className="font-medium">BMR:</span> {bmr} calories/day
              <div className="text-sm text-gray-500">Calories burned at complete rest</div>
            </div>
            <div>
              <span className="font-medium">TDEE:</span> {tdee} calories/day
              <div className="text-sm text-gray-500">Total calories burned daily with activity</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Daily Nutrition Goals</h2>
          <div className="space-y-4">
            <div>
              <span className="font-medium">Daily Calorie Target:</span> {calorieTarget} calories
            </div>
            <div>
              <span className="font-medium">Protein:</span> {macros.protein}g 
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, 100 * macros.protein / (calorieTarget / 4))}%` }}></div>
              </div>
            </div>
            <div>
              <span className="font-medium">Carbohydrates:</span> {macros.carbs}g
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(100, 100 * macros.carbs / (calorieTarget / 4))}%` }}></div>
              </div>
            </div>
            <div>
              <span className="font-medium">Fat:</span> {macros.fat}g
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${Math.min(100, 100 * macros.fat / (calorieTarget / 9))}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded shadow md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Your Fitness Goal</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Primary Goal:</span> {formData.primaryGoal}</p>
            <p><span className="font-medium">Weekly Exercise:</span> {formData.weeklyExercise}</p>
            <p><span className="font-medium">Activity Level:</span> {formData.activityLevel}</p>
            
            <div className="mt-4 p-4 bg-blue-50 rounded">
              <p className="font-medium">Personalized Recommendation:</p>
              <p className="mt-2">
                Based on your {formData.primaryGoal.toLowerCase().replace(/[^\w\s]/gi, '')}, 
                we recommend focusing on a balanced approach of strength training and cardio 
                {formData.weeklyExercise.split('/')[0]} times per week, with a daily calorie 
                target of {calorieTarget} calories.
              </p>
            </div>
          </div>
        </div>
      </div>

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