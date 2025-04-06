import React, { useState, useEffect, useRef } from 'react'; // Add useRef import
import * as calculations from '@/utils/healthMetricsCalculator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  UtensilsCrossed, 
  User, 
  ChevronRight, 
  LogOut, 
  LayoutGrid, 
  Calendar,
  Settings,
  AlertCircle,
  Bell,
  BarChart2,
  Sparkles,
  Moon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Import components
import HealthSummary from './components/HealthSummary';
import DynamicAISummary from './components/DynamicAISummary';
import AICoach from '../coach/AICoach';
import NutritionCard from '../nutrition/NutritionCard'; 
import WorkoutCard from '../workout/WorkoutCard';
import SleepAnalytics from '../sleep/SleepAnalytics';

/**
 * Main Dashboard Component
 * Serves as the central hub for the application
 */
const Dashboard = () => {
  // Auth context and state
  const { 
    currentUser, 
    userProfile, 
    onboardingData, 
    fetchUserData, 
    fetchOnboardingData, 
    logout 
  } = useAuth();
  
  // Create a ref for the AICoach component
  const aiCoachRef = useRef(null);
  
  // Component state
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState({});
  const [aiChatOpen, setAiChatOpen] = useState(false);

  /**
   * Calculate user's health metrics from raw data
   */
  const calculateHealthMetrics = (userData) => {
    try {
      // Safety check for required data
      if (!userData.height || !userData.weight) {
        return;
      }
      
      // Calculate BMI
      const bmi = calculations.calculateBMI(
        userData.height, 
        userData.weight, 
        userData.heightUnit,
        userData.weightUnit
      );
      
      // Calculate BMR (Basal Metabolic Rate)
      const bmr = calculations.calculateBMR(
        userData.height,
        userData.weight,
        userData.gender,
        userData.dateOfBirth,
        userData.heightUnit,
        userData.weightUnit
      );
      
      // Calculate TDEE (Total Daily Energy Expenditure)
      const tdee = calculations.calculateTDEE(bmr, userData.activityLevel);
      
      // Calculate daily calorie target based on fitness goals
      const calorieTarget = calculations.calculateCalorieTarget(tdee, userData.primaryGoal);
      
      // Calculate recommended macronutrient distribution
      const macros = calculations.calculateMacros(calorieTarget, userData.primaryGoal);
      
      // Get BMI category and associated UI color
      const { category: bmiCategory, color: bmiColor } = calculations.getBMICategory(bmi);
      
      // Update state with all calculated metrics
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

  /**
   * Load user data on component mount or when auth context changes
   */
  useEffect(() => {
    const loadUserData = async () => {
      console.log("🔄 Dashboard: Starting to load user data...");
      try {
        setIsLoading(true);
        setError(null);
        
        // Ensure we have both user profile and onboarding data
        let profile = userProfile;
        let onboarding = onboardingData;
        
        // Only fetch if we don't have the data already
        if (!profile) {
          profile = await fetchUserData();
          if (!profile) {
            throw new Error('Could not retrieve user profile');
          }
        }
        
        // Onboarding data might not exist for new users
        if (!onboarding) {
          onboarding = await fetchOnboardingData();
        }
        
        // Format user data with proper fallbacks
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
        
        // Update user data state
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

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  /**
   * Handle sleep data processing
   */
  const handleSleepDataProcessed = (sleepData) => {
    if (sleepData && sleepData.length > 0 && aiCoachRef.current) {
      console.log("Sleep data processed, updating AI Coach context...", sleepData.length);
      
      // Calculate recent sleep metrics for summary
      const recentData = sleepData.slice(-7); // Get last week
      
      // Process the data and update coach context
      aiCoachRef.current.updateContext({ 
        sleepData: sleepData,
        sleepSummaryForDisplay: `${recentData.length} days of sleep data analyzed`
      });
      
      // Force a context refresh on the coach
      setTimeout(() => {
        if (aiCoachRef.current) {
          aiCoachRef.current.refreshContext();
        }
      }, 1000);
    }
  };

  /**
   * Render error state when something goes wrong
   */
  if (error && !isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="bg-red-50 border-l-4 border-[#e72208] p-6 rounded-lg shadow-sm">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 mr-3 text-[#e72208] flex-shrink-0" />
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-0">
      {/* Enhanced top navigation bar */}
      <div className="sticky top-0 z-30 w-full bg-white border-b border-gray-100 shadow-sm backdrop-blur-sm bg-white/95">
  <div className="max-w-7xl mx-auto px-4 md:px-6">
    <div className="flex justify-between items-center h-16">
      <div className="flex items-center">
        <div className="bg-gradient-to-r from-[#4D55CC] to-[#3E7B27] p-1.5 rounded-lg mr-2">
          <LayoutGrid className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#4D55CC] to-[#3E7B27] bg-clip-text text-transparent">
          Project Health
        </h1>
      </div>
      
      {userData && (
        <div className="flex items-center gap-4">
          {/* User avatar */}
          <div className="flex items-center">
            {userData.photoURL ? (
              <img 
                src={userData.photoURL} 
                alt={userData.displayName || "User"} 
                className="h-9 w-9 rounded-full border-2 border-white shadow-sm"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-[#4D55CC] to-[#3E7B27] flex items-center justify-center text-white">
                {userData.displayName ? userData.displayName.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
          
          {/* Logout button */}
          <button 
            onClick={handleLogout}
            className="py-1.5 px-3 text-sm font-medium text-white bg-[#e13e29] hover:bg-[#d31d04] rounded-md flex items-center"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4 mr-1.5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  </div>
</div>
      
      {/* Main content container */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-8 pb-20 relative z-10">
        {/* Secondary dashboard title with greeting */}
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <span className="text-sm text-gray-500 font-medium mb-1 block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
            <h2 className="text-3xl font-bold text-gray-800">
              Hello, {userData?.displayName?.split(' ')[0] || 'there'} 👋
            </h2>
          </div>
        </div>

        {/* AI Summary - Direct component, no extra card wrapper */}
        <DynamicAISummary 
          userData={userData || {}}
          healthMetrics={healthMetrics}
          activeTab={activeTab}
          onChatOpen={() => setAiChatOpen(true)}
          isRenamed={true}
        />
        
        {/* Improved Tabs navigation */}
        <Tabs 
          defaultValue="home" 
          className="w-full" 
          onValueChange={setActiveTab}
          value={activeTab}
        >
          {/* Improved Tab Navigation */}
          <div className="mb-8">
            <TabsList className="inline-flex p-1 rounded-xl bg-gray-100/80 shadow-sm">
              <TabsTrigger 
                value="home" 
                className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#4D55CC] transition-all"
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="nutrition" 
                className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#3E7B27] transition-all"
              >
                <UtensilsCrossed className="h-4 w-4 mr-2" />
                <span>Nutrition</span>
              </TabsTrigger>
              <TabsTrigger 
                value="fitness" 
                className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#e72208] transition-all"
              >
                <Activity className="h-4 w-4 mr-2" />
                <span>Fitness</span>
              </TabsTrigger>
              <TabsTrigger 
                value="sleep" 
                className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#4D55CC] transition-all"
              >
                <Moon className="h-4 w-4 mr-2" />
                <span>Sleep</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Loading state */}
          {isLoading ? (
            <div className="w-full h-64 flex justify-center items-center mt-4 mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4D55CC]"></div>
                <p className="mt-4 text-gray-500">Loading your personalized dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Dashboard Tab - Shows health overview first */}
              <TabsContent value="home" className="space-y-8 mt-0">
                {/* Health summary metrics - Only on Dashboard tab */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <BarChart2 className="h-5 w-5 mr-2 text-[#4D55CC]" />
                    Health Overview
                  </h3>
                  <HealthSummary 
                    userData={userData || {}} 
                    healthMetrics={healthMetrics}
                  />
                </div>
              
                {/* Improved AI Coach Card */}
                <div className="overflow-hidden rounded-2xl shadow-md border-0 bg-white">
                  <div className="bg-gradient-to-r from-[#4D55CC] to-[#3E7B27] p-4 flex items-center">
                    <div className="bg-white/20 p-2 rounded-lg mr-3">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Chat with Oats</h3>
                      <p className="text-xs text-white/80">Your AI Health &amp; Fitness Coach</p>
                    </div>
                  </div>
                    <AICoach 
                      ref={aiCoachRef}
                      userData={userData || {}} 
                      healthMetrics={healthMetrics}
                      contextHint={activeTab}
                      hideHeader={true}
                      fixedHeight={true}
                    />
                </div>
                
                {/* Quick Access Section with improved cards */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-[#4D55CC]" />
                    Quick Access
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Nutrition Card */}
                    <Card className="overflow-hidden rounded-2xl hover:shadow-md transition-all duration-300 border-0 shadow bg-white group">
                      <CardContent className="p-0">
                        <button 
                          className="w-full p-6 text-left relative"
                          onClick={() => setActiveTab('nutrition')}
                        >
                          <div className="absolute inset-0 bg-[#3E7B27]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="p-2.5 rounded-xl bg-[#3E7B27]/10 mb-4 w-fit">
                            <UtensilsCrossed className="h-5 w-5 text-[#3E7B27]" />
                          </div>
                          <h4 className="text-lg font-medium text-gray-800 mb-1">Meal Plan</h4>
                          <p className="text-sm text-gray-500 mb-4">View your personalized nutrition plan</p>
                          <div className="flex items-center text-[#3E7B27] text-sm font-medium group-hover:translate-x-0.5 transition-transform">
                            <span>Go to nutrition</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </button>
                      </CardContent>
                    </Card>
                    
                    {/* Fitness Card */}
                    <Card className="overflow-hidden rounded-2xl hover:shadow-md transition-all duration-300 border-0 shadow bg-white group">
                      <CardContent className="p-0">
                        <button 
                          className="w-full p-6 text-left relative"
                          onClick={() => setActiveTab('fitness')}
                        >
                          <div className="absolute inset-0 bg-[#e72208]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="p-2.5 rounded-xl bg-[#e72208]/10 mb-4 w-fit">
                            <Activity className="h-5 w-5 text-[#e72208]" />
                          </div>
                          <h4 className="text-lg font-medium text-gray-800 mb-1">Workouts</h4>
                          <p className="text-sm text-gray-500 mb-4">Access your fitness training plan</p>
                          <div className="flex items-center text-[#e72208] text-sm font-medium group-hover:translate-x-0.5 transition-transform">
                            <span>Go to fitness</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </button>
                      </CardContent>
                    </Card>
                    
                    {/* Profile Card */}
                    <Card className="overflow-hidden rounded-2xl hover:shadow-md transition-all duration-300 border-0 shadow bg-white group">
                      <CardContent className="p-0">
                        <button className="w-full p-6 text-left relative">
                          <div className="absolute inset-0 bg-[#4D55CC]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="p-2.5 rounded-xl bg-[#4D55CC]/10 mb-4 w-fit">
                            <User className="h-5 w-5 text-[#4D55CC]" />
                          </div>
                          <h4 className="text-lg font-medium text-gray-800 mb-1">Profile</h4>
                          <p className="text-sm text-gray-500 mb-4">Update your personal information</p>
                          <div className="flex items-center text-[#4D55CC] text-sm font-medium group-hover:translate-x-0.5 transition-transform">
                            <span>View profile</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              {/* Nutrition Tab */}
              <TabsContent value="nutrition" className="mt-0">
                <Card className="rounded-2xl shadow-md border-0 bg-white">
                  <CardContent className="p-6">
                    <NutritionCard 
                      userData={userData || {}}
                      healthMetrics={healthMetrics}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Fitness Tab */}
              <TabsContent value="fitness" className="mt-0">
                <Card className="rounded-2xl shadow-md border-0 bg-white">
                  <CardContent className="p-6">
                    <WorkoutCard
                      userData={userData || {}}
                      healthMetrics={healthMetrics}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sleep Tab */}
              <TabsContent value="sleep" className="mt-0">
                <Card className="rounded-2xl shadow-md border-0 bg-white">
                  <CardContent className="p-6">
                    <SleepAnalytics 
                      userData={userData || {}}
                      healthMetrics={healthMetrics}
                      onDataProcessed={handleSleepDataProcessed}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;