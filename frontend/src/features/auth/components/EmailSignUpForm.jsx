import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '@/components/ui/button';

const EmailSignUpForm = ({ onSignUpSuccess, loading, setLoading, setError, formData }) => {
  const { signUpWithEmail, submitOnboardingData } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      console.log("🔄 Starting email signup process...");
      const result = await signUpWithEmail(email, password);
      console.log("✅ Email signup successful, user created");
      
      // Format onboarding data
      if (formData && Object.keys(formData).filter(key => !!formData[key]).length > 0) {
        try {
          console.log("📊 Processing onboarding data for submission...");
          
          // Ensure we have a fresh token
          console.log("🔄 Getting fresh token for new user...");
          const token = await result.user.getIdToken(true);
          console.log("✅ Fresh token obtained for new user");
          
          // Format onboarding data for backend
          const formattedData = {
            dob: formData.dateOfBirth || '',
            gender: formData.gender?.toLowerCase() || '',
            height_in_cm: formData.heightUnit === 'cm' 
              ? parseInt(formData.height || '0') 
              : Math.round(parseInt(formData.height || '0') * 2.54),
            weight_in_kg: formData.weightUnit === 'kg'
              ? parseInt(formData.weight || '0')
              : Math.round(parseInt(formData.weight || '0') / 2.205),
            primary_fitness_goal: formData.primaryGoal || '',
            target_weight: parseInt(formData.targetWeight || '0') || 0,
            daily_activity_level: formData.activityLevel || '',
            exercise_availability: formData.weeklyExercise || '',
            health_conditions: Array.isArray(formData.healthConditions) 
              ? formData.healthConditions 
              : [],
            other_medical_conditions: formData.otherCondition || ''
          };
          
          // Submit data
          console.log("📤 Submitting onboarding data:", formattedData);
          await submitOnboardingData(formattedData, token);
          console.log("✅ Onboarding data submitted successfully");
        } catch (onboardingError) {
          console.error("❌ Error submitting onboarding data:", onboardingError);
          // Continue anyway
        }
      } else {
        console.log("📊 No form data to submit");
      }
      
      // Pass the authenticated user to the parent component
      onSignUpSuccess();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please log in instead.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address. Please check your email.');
      } else {
        setError(error.message);
      }
      console.error("❌ Error during signup:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3E7B27]/30 focus:border-[#3E7B27] transition-all outline-none"
          placeholder="your@email.com"
        />
      </div>
      
      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          id="signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3E7B27]/30 focus:border-[#3E7B27] transition-all outline-none"
          placeholder="••••••••"
        />
      </div>
      
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3E7B27]/30 focus:border-[#3E7B27] transition-all outline-none"
          placeholder="••••••••"
        />
      </div>
      
      <Button 
        type="submit"
        disabled={loading} 
        className="w-full py-2.5 bg-[#3E7B27] hover:bg-[#346A21] text-white font-medium rounded-lg transition-all"
      >
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
};

export default EmailSignUpForm;