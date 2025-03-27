import React, { useState, useEffect } from 'react';
import * as calculations from '@/utils/healthMetricsCalculator';
import DashboardHeader from './components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, UtensilsCrossed, LineChart, Layout, LogOut } from 'lucide-react';
import OverviewTab from './tabs/OverviewTab/OverviewTab';
import NutritionTab from '../nutrition/NutritionCard';
import WorkoutTab from '../workout/WorkoutTab';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser, userProfile, onboardingData, fetchUserData, fetchOnboardingData, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState({});
  const [rawApiResponse, setRawApiResponse] = useState(null);
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Handle logout action
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will happen automatically through the auth state change
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  // Fetch user data and process it
  useEffect(() => {
    const loadUserData = async () => {
      console.log("🔄 Dashboard: Starting to load user data...");
      try {
        setIsLoading(true);
        setError(null); // Reset any previous errors
        console.log("🔄 Dashboard: Loading state set, previous errors cleared");
        
        // Ensure we have both user profile and onboarding data
        let profile = userProfile;
        let onboarding = onboardingData;
        
        console.log("📋 Current user profile in state:", profile);
        console.log("📋 Current onboarding data in state:", onboarding);
        
        // Only fetch if we don't have the data already
        if (!profile) {
          console.log("🔄 Dashboard: User profile not found in state, fetching from API...");
          profile = await fetchUserData();
          console.log("📋 Dashboard: Fetched user profile:", profile);
          
          if (!profile) {
            console.error("❌ Dashboard: Could not retrieve user profile from API");
            throw new Error('Could not retrieve user profile');
          }
        }
        
        // Onboarding data might not exist for new users
        if (!onboarding) {
          console.log("🔄 Dashboard: Onboarding data not found in state, fetching from API...");
          onboarding = await fetchOnboardingData();
          console.log("📋 Dashboard: Fetched onboarding data:", onboarding);
          // Don't throw if onboarding is null - new users might not have it
        }
        
        console.log("🔄 Dashboard: Formatting user data from API responses...");
        // Format data from both API responses with safe fallbacks
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
          heightUnit: 'cm',  // Backend stores in cm
          weightUnit: 'kg',  // Backend stores in kg
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
          console.log("🔄 Dashboard: Required data available, calculating health metrics...");
          calculateHealthMetrics(formattedUserData);
        } else {
          console.warn("⚠️ Dashboard: Missing height or weight data for calculations");
          console.log("ℹ️ Dashboard: Height:", formattedUserData.height, "Weight:", formattedUserData.weight);
        }
      } catch (error) {
        console.error("❌ Dashboard: Error loading dashboard data:", error);
        console.error("❌ Dashboard: Error details:", error.stack);
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        console.log("✅ Dashboard: Data loading process complete");
        setIsLoading(false);
      }
    };
    
    if (currentUser) {
      console.log("🔄 Dashboard: User is authenticated, loading data...");
      console.log("👤 Current user:", currentUser.email);
      loadUserData();
    } else {
      console.log("⚠️ Dashboard: No authenticated user found");
      setIsLoading(false);
      setError("No authenticated user found. Please log in.");
    }
  }, [currentUser, userProfile, onboardingData, fetchUserData, fetchOnboardingData]);

  // Separate function to calculate health metrics
  const calculateHealthMetrics = (userData) => {
    console.log("🔄 Dashboard: Starting health metrics calculation...");
    try {
      if (!userData.height || !userData.weight) {
        console.warn("⚠️ Dashboard: Cannot calculate metrics - missing height or weight");
        return; // Exit early if data is missing
      }
      
      console.log("🔄 Dashboard: Calculating BMI...");
      const bmi = calculations.calculateBMI(
        userData.height, 
        userData.weight, 
        userData.heightUnit,
        userData.weightUnit
      );
      console.log("📊 Dashboard: BMI calculated:", bmi);
      
      console.log("🔄 Dashboard: Calculating BMR...");
      const bmr = calculations.calculateBMR(
        userData.height,
        userData.weight,
        userData.gender,
        userData.dateOfBirth,
        userData.heightUnit,
        userData.weightUnit
      );
      console.log("📊 Dashboard: BMR calculated:", bmr);
      
      console.log("🔄 Dashboard: Calculating TDEE...");
      const tdee = calculations.calculateTDEE(bmr, userData.activityLevel);
      console.log("📊 Dashboard: TDEE calculated:", tdee);
      
      console.log("🔄 Dashboard: Calculating calorie target...");
      const calorieTarget = calculations.calculateCalorieTarget(tdee, userData.primaryGoal);
      console.log("📊 Dashboard: Calorie target calculated:", calorieTarget);
      
      console.log("🔄 Dashboard: Calculating macros...");
      const macros = calculations.calculateMacros(calorieTarget, userData.primaryGoal);
      console.log("📊 Dashboard: Macros calculated:", macros);
      
      // Get BMI category and color
      console.log("🔄 Dashboard: Determining BMI category...");
      const { category: bmiCategory, color: bmiColor } = calculations.getBMICategory(bmi);
      console.log("📊 Dashboard: BMI Category:", bmiCategory, "Color:", bmiColor);
      
      // Update health metrics state
      console.log("🔄 Dashboard: Updating health metrics state...");
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
      console.log("✅ Dashboard: Health metrics updated successfully");
    } catch (error) {
      console.error("❌ Dashboard: Error calculating health metrics:", error);
      console.error("❌ Dashboard: Error details:", error.stack);
    }
  };

  // Display error state
  if (error && !isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex items-start">
            <svg className="h-6 w-6 mr-3 text-red-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold text-red-700">Error loading dashboard</p>
              <p className="mt-1 text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
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
    <div className="p-4 md:p-6 max-w-6xl mx-auto relative">
      {/* User profile and logout area */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-4">
        {/* User profile info */}
        {userData && (
          <div className="flex items-center">
            {userData.photoURL ? (
              <img 
                src={userData.photoURL} 
                alt={userData.displayName || "User"} 
                className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#4D55CC] to-[#3E7B27] flex items-center justify-center text-white font-medium shadow-sm">
                {userData.displayName ? userData.displayName.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            
            <div className="ml-3 hidden md:block">
              <p className="text-sm font-medium text-gray-700">{userData.displayName || "User"}</p>
              <p className="text-xs text-gray-500 truncate max-w-[150px]">{userData.email}</p>
            </div>
          </div>
        )}
        
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4D55CC]"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </button>
      </div>

      <DashboardHeader 
        userData={userData || {}} 
        healthMetrics={healthMetrics} 
      />
      
      {/* Tabs for different dashboard sections */}
      <Tabs defaultValue="overview" className="w-full mt-8" onValueChange={setActiveTab}>
        <div className="border-b mb-6">
          <TabsList className="flex justify-between max-w-3xl mx-auto">
            {/* Tab triggers */}
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
            
            {/* Other tab triggers */}
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
          </TabsList>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="w-full h-64 flex justify-center items-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4D55CC]"></div>
              <p className="mt-4 text-gray-500">Loading your personalized dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Tab contents */}
            <TabsContent value="overview" className="animate-in fade-in-50 duration-300">
              <OverviewTab 
                userData={userData || {}} 
                healthMetrics={healthMetrics} 
              />
            </TabsContent>
            
            <TabsContent value="nutrition" className="animate-in fade-in-50 duration-300">
              <NutritionTab 
                userData={userData || {}} 
                healthMetrics={healthMetrics} 
              />
            </TabsContent>
            
            <TabsContent value="fitness" className="animate-in fade-in-50 duration-300">
              <WorkoutTab
                userData={userData || {}}
                healthMetrics={healthMetrics}
              />
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
      
      {/* Debug panel - only shown in development */}
      {isDevelopment && (
        <div className="mt-10 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <details>
            <summary className="font-mono text-sm cursor-pointer text-gray-500">Debug Information</summary>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-mono text-xs text-gray-500 mb-1">Raw API Response:</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(rawApiResponse, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="font-mono text-xs text-gray-500 mb-1">Formatted User Data:</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(userData, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default Dashboard;