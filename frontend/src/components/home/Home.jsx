import React, { useState } from 'react';
import HomeHero from './HomeHero';
import OnboardingForm from '../onboarding/OnboardingForm';
import Dashboard from '../dashboard/Dashboard';

const Home = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
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

  const handleSubmit = () => {
    console.log('Form data submitted:', formData);
    setShowDashboard(true);
  };

  if (showDashboard) {
    return <Dashboard formData={formData} />;
  }

  if (!showOnboarding) {
    return <HomeHero onGetStarted={handleGetStarted} />;
  }

  return (
    <OnboardingForm 
      formData={formData} 
      setFormData={setFormData} 
      onSubmit={handleSubmit} 
    />
  );
};

export default Home;