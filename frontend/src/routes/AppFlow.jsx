/* Acts as the app's router/controller
Manages which screen is displayed (onboarding, login, dashboard)
Stores and passes form data between components
Coordinates the flow from onboarding to login to dashboard */

import React, { useState } from 'react';
import LandingPage from '../pages/landing/LandingPage';
import OnboardingForm from '../features/onboarding/OnboardingForm';
import Dashboard from '../features/dashboard/Dashboard';
import Login from '../features/auth/components/Login';
import { useAuth } from '../contexts/AuthContext';

const AppFlow = () => {
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

  // When getting started from landing page
  const handleGetStarted = () => {
    setShowOnboarding(true);
  };

  // When completing the onboarding form
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowLogin(true);
    // formData is now filled with all the questionnaire answers
  };

  // When login is successful
  const handleLoginSuccess = () => {
    setShowLogin(false);
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

  // Show dashboard if user is logged in
  if (currentUser && (showDashboard || !showOnboarding && !showLogin)) {
    return <Dashboard />;
  }

  // Show login after onboarding or directly from navbar
  if (showLogin) {
    return <Login 
      onLoginSuccess={handleLoginSuccess} 
      formData={formData} // Pass form data to login component
    />;
  }

  // Show onboarding form after clicking "Get Started"
  if (showOnboarding) {
    return (
      <OnboardingForm 
        formData={formData} 
        setFormData={setFormData} 
        onSubmit={handleOnboardingComplete} 
      />
    );
  }

  // Show landing page by default
  return <LandingPage 
    onGetStarted={handleGetStarted} 
    onLogin={() => setShowLogin(true)} // Add direct login option
  />;
};

export default AppFlow;