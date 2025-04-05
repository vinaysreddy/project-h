import React, { useState, useEffect } from 'react';
import * as calculations from '@/utils/healthMetricsCalculator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, UtensilsCrossed, Bot, User, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Import components
import HealthSummary from './components/HealthSummary';
import DailyPlan from './components/DailyPlan';
import DynamicAISummary from './components/DynamicAISummary';
import FloatingChatButton from '../coach/components/FloatingChatButton';
import NutritionCard from '../nutrition/NutritionCard'; 
import WorkoutCard from '../workout/WorkoutCard'; 

const Dashboard = () => {
  const { currentUser, userProfile, onboardingData, fetchUserData, fetchOnboardingData, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState({});
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Fetch user data and process it
  useEffect(() => {
    const loadUserData = async () => {
      console.log("🔄 Dashboard: Starting to load user data...");
      try {
        setIsLoading(true);
        setError(null);
        
        // Ensure we have both user profile and onboarding data
        let profile = userProfile;
        let onboarding = onboardingData;
        
        console.log("📋 Current user profile in state:", profile);
        console.log("📋 Current onboarding data in state:", onboarding);
        
        // Only fetch if we don't have the data already
        if (!profile) {
          console.log("🔄 Dashboard: User profile not found in state, fetching from API...");
          profile = await fetchUserData();
          if (!profile) {
            throw new Error('Could not retrieve user profile');
          }
        }
        
        // Onboarding data might not exist for new users
        if (!onboarding) {
          console.log("🔄 Dashboard: Onboarding data not found in state, fetching from API...");
          onboarding = await fetchOnboardingData();
        }
        
        const formattedUserData = {
          // From user profile
          displayName: profile?.name || profile?.displayName || '',
          email: profile?.email || '',
          photoURL: profile?.photoURL || '',
          
          // From onboarding data with safe fallbacks
          dateOfBirth: onboarding?.dob || '',
          gender: onboarding?.gender || '',
          height: onboarding?.height_in_cm || 0,
          weight: onboarding?.weight_in_kg || 0,
          heightUnit: 'cm',
          weightUnit: 'kg',
          primaryGoal: onboarding?.primary_fitness_goal || '',
          targetWeight: onboarding?.target_weight || 0,
          activityLevel: onboarding?.daily_activity_level || '',
          weeklyExercise: onboarding?.exercise_availability || '',
          healthConditions: onboarding?.health_conditions || [],
          otherCondition: onboarding?.other_medical_conditions || ''
        };
        
        console.log("📋 Dashboard: Formatted user data:", formattedUserData);
        setUserData(formattedUserData);
        
        // Calculate health metrics only if we have necessary data
        if (formattedUserData.height > 0 && formattedUserData.weight > 0) {
          calculateHealthMetrics(formattedUserData);
        } else {
          console.warn("⚠️ Dashboard: Missing height or weight data for calculations");
        }
      } catch (error) {
        console.error("❌ Dashboard: Error loading dashboard data:", error);
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (currentUser) {
      loadUserData();
    } else {
      setIsLoading(false);
      setError("No authenticated user found. Please log in.");
    }
  }, [currentUser, userProfile, onboardingData, fetchUserData, fetchOnboardingData]);

  // Separate function to calculate health metrics
  const calculateHealthMetrics = (userData) => {
    try {
      if (!userData.height || !userData.weight) {
        return;
      }
      
      const bmi = calculations.calculateBMI(
        userData.height, 
        userData.weight, 
        userData.heightUnit,
        userData.weightUnit
      );
      
      const bmr = calculations.calculateBMR(
        userData.height,
        userData.weight,
        userData.gender,
        userData.dateOfBirth,
        userData.heightUnit,
        userData.weightUnit
      );
      
      const tdee = calculations.calculateTDEE(bmr, userData.activityLevel);
      
      const calorieTarget = calculations.calculateCalorieTarget(tdee, userData.primaryGoal);
      
      const macros = calculations.calculateMacros(calorieTarget, userData.primaryGoal);
      
      const { category: bmiCategory, color: bmiColor } = calculations.getBMICategory(bmi);
      
      setHealthMetrics({
        bmi,
        bmiCategory,
        bmiColor,
        weightUnit: userData.weightUnit,
        calorieTarget,
        tdee,
        bmr,
        macros     
      });
    } catch (error) {
      console.error("❌ Dashboard: Error calculating health metrics:", error);
    }
  };

  // Handle logout action
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  // Display error state
  if (error && !isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="bg-red-50 border-l-4 border-[#e72208] p-6 rounded-lg">
          <div className="flex items-start">
            <svg className="h-6 w-6 mr-3 text-[#e72208] flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold text-[#e72208]">Error loading dashboard</p>
              <p className="mt-1 text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-red-100 text-[#e72208] rounded hover:bg-red-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-6 relative overflow-hidden">
      {/* Background circles for visual consistency with other pages */}
      <div className="absolute top-20 -right-40 w-80 h-80 rounded-full bg-[#e72208]/5 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[#3E7B27]/5 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-[#4D55CC]/5 blur-3xl"></div>
      
      {/* Floating AI chat button that follows the user */}
      <FloatingChatButton 
        userData={userData || {}} 
        healthMetrics={healthMetrics} 
        activeTab={activeTab}
        isOpen={aiChatOpen}
        onOpenChange={setAiChatOpen}
      />
      
      {/* Main content container */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* User profile area */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Health Dashboard</h1>
          
          {userData && (
            <div className="flex items-center gap-3">
              {userData.photoURL ? (
                <img 
                  src={userData.photoURL} 
                  alt={userData.displayName || "User"} 
                  className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#4D55CC] to-[#3E7B27] flex items-center justify-center text-white">
                  {userData.displayName ? userData.displayName.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600">
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
        
        {/* Dynamic AI Summary at the top */}
        <DynamicAISummary 
          userData={userData || {}}
          healthMetrics={healthMetrics}
          activeTab={activeTab}
          onChatOpen={() => setAiChatOpen(true)}
        />
        
        {/* Tabs navigation followed by health summary */}
        <Tabs defaultValue="home" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="fitness">Fitness</TabsTrigger>
          </TabsList>
          
          {/* Thin health summary */}
          <HealthSummary 
            userData={userData || {}} 
            healthMetrics={healthMetrics}
            className="mb-6"
          />

          {isLoading ? (
            <div className="w-full h-64 flex justify-center items-center mt-4">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4D55CC]"></div>
                <p className="mt-4 text-gray-500">Loading your personalized dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Home Tab */}
              <TabsContent value="home" className="space-y-6">
                
                {/* Main content */}
                <DailyPlan 
                  userData={userData || {}}
                  healthMetrics={healthMetrics}
                  onNutritionClick={() => setActiveTab('nutrition')}
                  onFitnessClick={() => setActiveTab('fitness')}
                />
                
                {/* Quick Actions Card */}
                <Card className="overflow-hidden border-gray-100 rounded-2xl shadow-md">
                  <div className="h-1 bg-gradient-to-r from-[#4D55CC] via-[#3E7B27] to-[#e72208]"></div>
                  <CardContent className="p-6">
                    <h3 className="text-md font-medium mb-4 text-gray-800">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="justify-between border-gray-200 hover:border-[#3E7B27] hover:bg-[#3E7B27]/5 transition-all" 
                        onClick={() => setActiveTab('nutrition')}
                      >
                        <div className="flex items-center">
                          <div className="p-1.5 rounded-full bg-[#3E7B27]/10 mr-2">
                            <UtensilsCrossed className="h-4 w-4 text-[#3E7B27]" />
                          </div>
                          <span>My Meal Plan</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="justify-between border-gray-200 hover:border-[#e72208] hover:bg-[#e72208]/5 transition-all" 
                        onClick={() => setActiveTab('fitness')}
                      >
                        <div className="flex items-center">
                          <div className="p-1.5 rounded-full bg-[#e72208]/10 mr-2">
                            <Activity className="h-4 w-4 text-[#e72208]" />
                          </div>
                          <span>My Workouts</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="justify-between border-gray-200 hover:border-[#4D55CC] hover:bg-[#4D55CC]/5 transition-all"
                        onClick={() => setAiChatOpen(true)}
                      >
                        <div className="flex items-center">
                          <div className="p-1.5 rounded-full bg-[#4D55CC]/10 mr-2">
                            <Bot className="h-4 w-4 text-[#4D55CC]" />
                          </div>
                          <span>Ask RIA</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="justify-between border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all"
                      >
                        <div className="flex items-center">
                          <div className="p-1.5 rounded-full bg-gray-100 mr-2">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <span>Update Profile</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Nutrition Tab */}
              <TabsContent value="nutrition" className="space-y-6">
                
                <NutritionCard 
                  userData={userData || {}}
                  healthMetrics={healthMetrics}
                />
              </TabsContent>
              
              {/* Fitness Tab */}
              <TabsContent value="fitness" className="space-y-6">
                
                <WorkoutCard
                  userData={userData || {}}
                  healthMetrics={healthMetrics}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;