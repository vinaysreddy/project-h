/* Acts as the app's router/controller
Manages which screen is displayed (onboarding, login, dashboard)
Stores and passes form data between components
Coordinates the flow from onboarding to login to dashboard */

import React, { useState } from 'react';
import LandingPage from '../pages/landing/LandingPage';
import OnboardingForm from '../features/onboarding/OnboardingForm';
import Dashboard from '../features/dashboard/Dashboard';
import Login from '../features/auth/components/Login';
import LoginPage from '../features/auth/components/LoginPage';
import { useAuth } from '../contexts/AuthContext';

const AppFlow = () => {
  const { currentUser } = useAuth();
  
  // Flow control states
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDirectLogin, setShowDirectLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  
  // Questionnaire data
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

  // Add a new function to handle going back to landing page
  const handleBackToLanding = () => {
    setShowDirectLogin(false);
    setShowOnboarding(false);
    setShowLogin(false);
    setShowDashboard(false);
  };

  // FLOW 1: Start the signup flow (Get Started → Onboarding → Signup/Login)
  const handleGetStarted = () => {
    setShowOnboarding(true);
    setShowDirectLogin(false);
    setShowLogin(false);
    setShowDashboard(false);
  };

  // FLOW 2: Start the direct login flow (Login → Dashboard)
  const handleDirectLogin = () => {
    setShowDirectLogin(true);
    setShowOnboarding(false);
    setShowLogin(false);
    setShowDashboard(false);
  };

  // When completing the onboarding form
  const handleOnboardingComplete = (data) => {
    setFormData(data); // Save the questionnaire data
    setShowOnboarding(false);
    setShowLogin(true); // Show login WITH signup options
  };

  // When login is successful
  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowDirectLogin(false);
    setShowDashboard(true);
    // Clear form data after successful login
    setFormData({
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
  };

  // Redirect from login page to signup flow
  const handleRedirectToSignup = () => {
    setShowDirectLogin(false);
    setShowOnboarding(true);
  };

  // Show dashboard if user is logged in
  if (currentUser && (showDashboard || (!showOnboarding && !showLogin && !showDirectLogin))) {
    return <Dashboard />;
  }

  // Show login with signup options after completing onboarding
  if (showLogin) {
    return <Login 
      onLoginSuccess={handleLoginSuccess} 
      formData={formData} // Pass questionnaire data to login component
      onBackToLanding={handleBackToLanding} // Add back functionality
    />;
  }

  // Show direct login component (no signup options)
  if (showDirectLogin) {
    return <LoginPage 
      onLoginSuccess={handleLoginSuccess}
      onRedirectToSignup={handleRedirectToSignup} // Allow redirect to signup flow
      onBackToLanding={handleBackToLanding} // Add back functionality
    />;
  }

  // Show onboarding form after clicking "Get Started"
  if (showOnboarding) {
    return (
      <OnboardingForm 
        formData={formData} 
        setFormData={setFormData} 
        onSubmit={handleOnboardingComplete} 
        onBackToLanding={handleBackToLanding} // Add back functionality
      />
    );
  }

  // Show landing page by default
  return <LandingPage 
    onGetStarted={handleGetStarted} 
    onLogin={handleDirectLogin} // Use direct login flow for "Login" click
  />;
};

export default AppFlow;