import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeHero from '../components/home/HomeHero';
import OnboardingForm from '../components/onboarding/OnboardingForm';
import Dashboard from '../components/dashboard/Dashboard';
import { createUserProfile } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
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

  // Check if user is already authenticated and has completed onboarding
  useEffect(() => {
    if (!loading && user) {
      if (user.userData) {
        // User has completed onboarding, show dashboard
        setShowDashboard(true);
      } else if (!showOnboarding) {
        // User is authenticated but hasn't completed onboarding
        setShowOnboarding(true);
      }
    }
  }, [user, loading, showOnboarding]);

  const handleGetStarted = () => {
    setShowOnboarding(true);
  };

  const handleSubmit = async () => {
    try {
      if (user) {
        // Save onboarding data to Firestore
        await createUserProfile(user.uid, {
          ...formData,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
        
        setShowDashboard(true);
      } else {
        // If not authenticated, show onboarding
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e72208]"></div>
      </div>
    );
  }

  if (showDashboard || (user && user.userData)) {
    return <Dashboard formData={user?.userData || formData} />;
  }

  if (showOnboarding) {
    return (
      <OnboardingForm 
        formData={formData} 
        setFormData={setFormData} 
        onSubmit={handleSubmit} 
      />
    );
  }

  return <HomeHero onGetStarted={handleGetStarted} />;
};

export default Home;