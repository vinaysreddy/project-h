import React, { useState, useEffect } from 'react';
import * as calculations from '@/utils/calculations';
import DashboardHeader from './DashboardHeader';
import DashboardFooter from './DashboardFooter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, UtensilsCrossed, LineChart, Layout } from 'lucide-react';
import OverviewTab from './OverviewTab';
import NutritionTab from '../nutrition/NutritionCard';

const Dashboard = ({ formData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [healthMetrics, setHealthMetrics] = useState({});

  // Calculate all metrics using imported calculation functions
  useEffect(() => {
    if (formData) {
      try {
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
        
        // Get BMI category and color
        const { category: bmiCategory, color: bmiColor } = calculations.getBMICategory(bmi);
        
        // Update health metrics state
        setHealthMetrics({
          bmi,
          bmiCategory,
          bmiColor,
          weightUnit: formData.weightUnit,
          calorieTarget,
          tdee,
          bmr,
          macros     
        });

      } catch (error) {
        console.error("Error calculating health metrics:", error);
      }
      
      // Simulate loading state for better UX
      setTimeout(() => setIsLoading(false), 600);
    }
  }, [formData]);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <DashboardHeader 
        userData={formData || {}} 
        healthMetrics={healthMetrics} 
      />
      
      {/* Improved Tabs for different dashboard sections */}
      <Tabs defaultValue="overview" className="w-full mt-8" onValueChange={setActiveTab}>
        <div className="border-b mb-6">
          <TabsList className="flex justify-between max-w-3xl mx-auto">
            <TabsTrigger 
              value="overview" 
              className={`flex items-center pb-2 px-4 border-b-2 transition-colors ${
                activeTab === 'overview' 
                  ? 'border-[#4D55CC] text-[#4D55CC] font-medium' 
                  : 'border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Layout className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            
            <TabsTrigger 
              value="nutrition" 
              className={`flex items-center pb-2 px-4 border-b-2 transition-colors ${
                activeTab === 'nutrition' 
                  ? 'border-[#3E7B27] text-[#3E7B27] font-medium' 
                  : 'border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UtensilsCrossed className="h-4 w-4 mr-2" />
              Nutrition
            </TabsTrigger>
            
            <TabsTrigger 
              value="fitness" 
              className={`flex items-center pb-2 px-4 border-b-2 transition-colors ${
                activeTab === 'fitness' 
                  ? 'border-[#e72208] text-[#e72208] font-medium' 
                  : 'border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Activity className="h-4 w-4 mr-2" />
              Fitness
            </TabsTrigger>
            
            <TabsTrigger 
              value="progress" 
              className={`flex items-center pb-2 px-4 border-b-2 transition-colors ${
                activeTab === 'progress' 
                  ? 'border-gray-800 text-gray-800 font-medium' 
                  : 'border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <LineChart className="h-4 w-4 mr-2" />
              Progress
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Improved loading state */}
        {isLoading ? (
          <div className="w-full h-64 flex justify-center items-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4D55CC]"></div>
              <p className="mt-4 text-gray-500">Loading your personalized dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Overview Tab - A comprehensive dashboard summary */}
            <TabsContent value="overview" className="animate-in fade-in-50 duration-300">
              <OverviewTab 
                userData={formData || {}} 
                healthMetrics={healthMetrics} 
              />
            </TabsContent>
            
            <TabsContent value="nutrition" className="animate-in fade-in-50 duration-300">
              <NutritionTab 
                userData={formData || {}} 
                healthMetrics={healthMetrics} 
              />
            </TabsContent>
            
            <TabsContent value="fitness" className="animate-in fade-in-50 duration-300">
              {/* Improved placeholder */}
              <div className="text-center p-12 border border-dashed rounded-lg">
                <Activity className="h-12 w-12 mx-auto text-[#e72208] opacity-30 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Fitness Plan Coming Soon</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Your custom workout routines are being created based on your fitness level and goals. Check back soon!
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="progress" className="animate-in fade-in-50 duration-300">
              {/* Improved placeholder */}
              <div className="text-center p-12 border border-dashed rounded-lg">
                <LineChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Progress Tracking Coming Soon</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Soon you'll be able to track your progress over time with detailed charts and insights. Check back after your journey begins!
                </p>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
      
      <DashboardFooter />
    </div>
  );
};

export default Dashboard;