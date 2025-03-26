import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { authenticateUser, saveUserBasicDetails } from '../../services/authService';

const Login = ({ onLoginSuccess, formData }) => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      // Start loading state and clear any previous errors
      setLoading(true);
      setError('');
      
      // Call Firebase authentication through the AuthContext
      const { token, user } = await signInWithGoogle();

      // Format the onboarding data for the backend
      const backendData = {
        questionnaireData: {
          dob: formData.dateOfBirth,
          gender: formData.gender?.toLowerCase() || '',
          // Convert height to cm if needed
          height_in_cm: formData.heightUnit === 'cm' ?
            parseInt(formData.height) :
            Math.round(parseInt(formData.height) * 2.54),
          // Convert weight to kg if needed
          weight_in_kg: formData.weightUnit === 'kg' ?
            parseInt(formData.weight) :
            Math.round(parseInt(formData.weight) / 2.205),
          primary_fitness_goal: formData.primaryGoal,
          target_weight: parseInt(formData.targetWeight || '0'),
          daily_activity_level: formData.activityLevel,
          exercise_availability: formData.weeklyExercise,
          health_conditions: formData.healthConditions || [],
          other_medical_conditions: formData.otherCondition || ''
        }
      };

      // Send user data and token to backend
      await authenticateUser(token, {
        ...backendData,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid
      });

      // After successful login, also send the onboarding data
      if (formData) {
        const formattedData = {
          dob: formData.dateOfBirth,
          gender: formData.gender?.toLowerCase() || '',
          height_in_cm: formData.heightUnit === 'cm' ?
            parseInt(formData.height || '0') :
            Math.round(parseInt(formData.height || '0') * 2.54),
          weight_in_kg: formData.weightUnit === 'kg' ?
            parseInt(formData.weight || '0') :
            Math.round(parseInt(formData.weight || '0') / 2.205),
          primary_fitness_goal: formData.primaryGoal || '',
          target_weight: parseInt(formData.targetWeight || '0'),
          daily_activity_level: formData.activityLevel || '',
          exercise_availability: formData.weeklyExercise || '',
          health_conditions: formData.healthConditions || [],
          other_medical_conditions: formData.otherCondition || ''
        };

        try {
          await saveUserBasicDetails(token, formattedData);
        } catch (onboardingError) {
          console.warn('Failed to save onboarding data, but login was successful', onboardingError);
        }
      }

      onLoginSuccess();
      
    } catch (error) {
      // Handle and display any errors
      console.error('Login error:', error);
      setError(error.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      // Always reset loading state regardless of success or failure
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-auto border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Personal Fitness Plan is Ready!</h2>
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[#e72208] via-[#3E7B27] to-[#4D55CC] rounded-full"></div>
        <p className="text-gray-700 mt-6 text-lg font-medium">
          You're just <span className="text-[#e72208] font-bold">one step away</span> from your optimal health and fitness journey
        </p>
      </div>

      {/* Error message display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 w-full text-red-700 text-sm rounded">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="w-full">
        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex items-center justify-center w-full py-5 px-6 rounded-lg shadow-md transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-[#e72208]/10 via-[#3E7B27]/10 to-[#4D55CC]/10 hover:from-[#e72208]/20 hover:via-[#3E7B27]/20 hover:to-[#4D55CC]/20 border-2 border-[#4D55CC]/20 hover:border-[#4D55CC]/40 hover:shadow-lg group"
        >
          {/* Colored left border with animation */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#e72208] via-[#3E7B27] to-[#4D55CC] group-hover:w-1.5 transition-all duration-300"></div>
          
          <div className="flex items-center justify-center">
            {/* Google icon */}
            <div className="bg-white p-2 rounded-full shadow-sm mr-4">
              <FcGoogle className="w-6 h-6" />
            </div>
            
            {/* Button text */}
            <span className="font-semibold text-gray-800 text-lg">
              {loading ? 'Signing in...' : 'Continue with Google'}
            </span>
            
            {/* Loading spinner */}
            {loading && (
              <svg className="animate-spin ml-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </div>
        </button>
        
        {/* Security message */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Your data is securely stored with Google</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;