import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const Login = ({ onLoginSuccess, formData }) => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const { token, user } = await signInWithGoogle();

      // Map your formData to match the expected backend format
      const backendData = {
        questionnaireData: {
          dob: formData.dateOfBirth,
          gender: formData.gender.toLowerCase(),
          height_in_cm: formData.heightUnit === 'cm' ?
            parseInt(formData.height) :
            Math.round(parseInt(formData.height) * 2.54),
          weight_in_kg: formData.weightUnit === 'kg' ?
            parseInt(formData.weight) :
            Math.round(parseInt(formData.weight) / 2.205),
          primary_fitness_goal: formData.primaryGoal,
          target_weight: parseInt(formData.targetWeight || '0'),
          daily_activity_level: formData.activityLevel,
          exercise_availability: formData.weeklyExercise,
          health_conditions: formData.healthConditions,
          other_medical_conditions: formData.otherCondition
        }
      };

      // Send user data and token to backend
      // This endpoint matches our updated backend route
      const response = await fetch('http://localhost:3000/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...backendData,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid
        })
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with server');
      }

      // After successful login, you should also send the onboarding data
      if (formData) {
        // Format the data to match what the backend expects
        const formattedData = {
          dob: formData.dateOfBirth,
          gender: formData.gender.toLowerCase(),
          height_in_cm: formData.heightUnit === 'cm' ?
            parseInt(formData.height) :
            Math.round(parseInt(formData.height) * 2.54),
          weight_in_kg: formData.weightUnit === 'kg' ?
            parseInt(formData.weight) :
            Math.round(parseInt(formData.weight) / 2.205),
          primary_fitness_goal: formData.primaryGoal,
          target_weight: parseInt(formData.targetWeight || '0'),
          daily_activity_level: formData.activityLevel,
          exercise_availability: formData.weeklyExercise,
          health_conditions: formData.healthConditions,
          other_medical_conditions: formData.otherCondition
        };

        // This endpoint also matches our updated backend route
        const onboardingResponse = await fetch('http://localhost:3000/api/user/onboarding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userData: formattedData
          })
        });

        if (!onboardingResponse.ok) {
          console.warn('Failed to save onboarding data, but login was successful');
        }
      }

      onLoginSuccess();
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create an Account</h2>
      <p className="text-gray-600 mb-6 text-center">
        Complete your registration to save your plan and track your progress
      </p>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors"
      >
        <FcGoogle className="w-5 h-5 mr-2" />
        <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
      </button>

      <p className="mt-4 text-sm text-gray-500">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default Login;