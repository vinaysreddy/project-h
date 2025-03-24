/* Acts as the app's router/controller
Manages which screen is displayed (onboarding, login, dashboard)
Stores and passes form data between components
Coordinates the flow from onboarding to login to dashboard */

import React, { useState } from 'react';
import HomeHero from './HomeHero';
import OnboardingForm from '../onboarding/OnboardingForm';
import Dashboard from '../dashboard/Dashboard';
import Login from '../auth/Login';
import { useAuth } from '../../contexts/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    gender: '',
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    primaryGoal: '',
    activityLevel: '',
    targetWeight: '',
    weeklyExercise: '',
    healthConditions: [],
    otherCondition: ''
  });

  const handleGetStarted = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    console.log('Onboarding data:', formData);
    setShowOnboarding(false);
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowDashboard(true);
  };

  // If user is already logged in and completed onboarding, show dashboard
  if (currentUser && showDashboard) {
    return <Dashboard formData={formData} />;
  }

  // Show login screen after onboarding
  if (showLogin) {
    return <Login onLoginSuccess={handleLoginSuccess} formData={formData} />;
  }

  // Show onboarding form if user clicked "Get Started"
  if (showOnboarding) {
    return (
      <OnboardingForm 
        formData={formData} 
        setFormData={setFormData} 
        onSubmit={handleOnboardingComplete} 
      />
    );
  }
  
  // Show homepage hero by default
  return <HomeHero onGetStarted={handleGetStarted} />;
};

export default Home;