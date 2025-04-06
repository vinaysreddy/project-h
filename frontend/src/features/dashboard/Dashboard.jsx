import React, { useState, useEffect } from 'react';
import * as calculations from '@/utils/healthMetricsCalculator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, UtensilsCrossed, Bot, User, 
  PieChart, ArrowRight, LogOut, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Import components
import DashboardHeader from './components/DashboardHeader';
import HealthSummary from './components/HealthSummary';
import DailyPlan from './components/DailyPlan';
import AiCoachWidget from './components/AiCoachWidget';
import NutritionCard from '../nutrition/NutritionCard'; 
import WorkoutCard from '../workout/WorkoutCard'; 
import AiCoachCard from './components/AiCoachCard';

const Dashboard = () => {
  const { currentUser, userProfile, onboardingData, fetchUserData, fetchOnboardingData, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState({});

  // Fetch user data and process it
  useEffect(() => {
    const loadUserData = async () => {
      
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
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
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

      {/* Add the DashboardHeader component */}
      <DashboardHeader
        userData={userData || {}}
        healthMetrics={healthMetrics}
      />

      {/* Main dashboard content */}
      <Tabs defaultValue="home" className="w-full mt-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="fitness">Fitness</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="w-full h-64 flex justify-center items-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4D55CC]"></div>
              <p className="mt-4 text-gray-500">Loading your personalized dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Home Tab - Main Dashboard */}
            <TabsContent value="home" className="space-y-6">
              {/* Health Metrics Summary Card */}
              <HealthSummary 
                userData={userData || {}} 
                healthMetrics={healthMetrics}
              />
              
              {/* AI Coach Widget - Condensed version */}
              <AiCoachWidget 
                userData={userData || {}} 
                healthMetrics={healthMetrics}
                onExpandClick={() => setActiveTab('coach')}
              />
              
              {/* Today's Plan Card (combines nutrition & fitness) */}
              <DailyPlan 
                userData={userData || {}}
                healthMetrics={healthMetrics}
                onNutritionClick={() => setActiveTab('nutrition')}
                onFitnessClick={() => setActiveTab('fitness')}
              />
              
              {/* Quick Actions Card */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-md font-medium mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="justify-between" 
                      onClick={() => setActiveTab('nutrition')}
                    >
                      <div className="flex items-center">
                        <UtensilsCrossed className="h-4 w-4 mr-2" />
                        <span>My Meal Plan</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-between" 
                      onClick={() => setActiveTab('fitness')}
                    >
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 mr-2" />
                        <span>My Workouts</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-between"
                      onClick={() => setActiveTab('coach')}
                    >
                      <div className="flex items-center">
                        <Bot className="h-4 w-4 mr-2" />
                        <span>Ask Coach</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-between"
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>Update Profile</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Nutrition Tab */}
            <TabsContent value="nutrition">
              <NutritionCard 
                userData={userData || {}}
                healthMetrics={healthMetrics}
              />
            </TabsContent>
            
            {/* Fitness Tab */}
            <TabsContent value="fitness">
              <WorkoutCard
                userData={userData || {}}
                healthMetrics={healthMetrics}
              />
            </TabsContent>
            
            {/* Coach Tab */}
            <TabsContent value="coach">
              <AiCoachCard
                userData={userData || {}}
                healthMetrics={healthMetrics}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Dashboard;