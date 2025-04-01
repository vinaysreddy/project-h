import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailLoginForm from './EmailLoginForm';
import EmailSignUpForm from './EmailSignUpForm';
import { Facebook, AlertCircle, ChevronLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = ({ onLoginSuccess, formData, onBackToLanding }) => {
  // Ensure formData exists
  if (!formData || Object.keys(formData).filter(key => formData[key]).length === 0) {
    console.warn('Login component received empty form data. This component should only be used after completing the questionnaire.');
  }

  const { signInWithGoogle, signInWithFacebook, submitOnboardingData, getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login'); // login or signup
  
  const prepareOnboardingData = (data) => {
    // Your existing data preparation code
    return {
      dob: data.dateOfBirth,
      gender: data.gender?.toLowerCase() || '',
      height_in_cm: data.heightUnit === 'cm' 
        ? parseInt(data.height || '0') 
        : Math.round(parseInt(data.height || '0') * 2.54),
      weight_in_kg: data.weightUnit === 'kg'
        ? parseInt(data.weight || '0')
        : Math.round(parseInt(data.weight || '0') / 2.205),
      primary_fitness_goal: data.primaryGoal || '',
      target_weight: parseInt(data.targetWeight || '0'),
      daily_activity_level: data.activityLevel || '',
      exercise_availability: data.weeklyExercise || '',
      health_conditions: data.healthConditions || [],
      other_medical_conditions: data.otherCondition || ''
    };
  };

  const handleThirdPartySignIn = async (signInMethod) => {
    try {
      setLoading(true);
      setError('');
      
      const result = await signInMethod();
      
      if (result.user) {
        // Submit onboarding data if it exists
        if (formData && Object.keys(formData).length > 0) {
          try {
            const token = await result.user.getIdToken();
            const formattedData = prepareOnboardingData(formData);
            await submitOnboardingData(formattedData, token);
          } catch (err) {
            console.error("Error submitting onboarding data:", err);
          }
        }
        
        onLoginSuccess();
      }
    } catch (err) {
      setError(`Failed to sign in: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = () => handleThirdPartySignIn(signInWithGoogle);
  const handleFacebookSignIn = () => handleThirdPartySignIn(signInWithFacebook);
  
  const handleEmailLoginSuccess = async (user) => {
    try {
      setLoading(true);
      setError('');
      
      console.log("✅ Email authentication successful for user:", user.email);
      
      if (formData && Object.keys(formData).length > 0) {
        try {
          console.log("📊 Form data to process:", formData);
          
          console.log("🔄 Getting token for onboarding submission...");
          const token = await user.getIdToken();
          console.log("✅ Token retrieved successfully");
          
          console.log("🔄 Preparing onboarding data...");
          const formattedData = prepareOnboardingData(formData);
          console.log("📊 Formatted onboarding data:", formattedData);
          
          console.log("🔄 Submitting onboarding data to backend...");
          // IMPORTANT: Wait for this to complete
          const result = await submitOnboardingData(formattedData, token);
          console.log("✅ Onboarding data submitted successfully:", result);
          
          // Small delay to ensure data is saved properly before redirect
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (submitError) {
          console.error("❌ Error submitting onboarding data:", submitError);
          
          if (submitError.response) {
            console.error("❌ Server response:", submitError.response.data);
            console.error("❌ Status code:", submitError.response.status);
          } else {
            console.error("❌ Error details:", submitError.message);
          }
          
          // Show error but continue with navigation
          setError("Your account was created, but we couldn't save your profile data. You can update it later in your dashboard.");
          
          // Give user time to read the message
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } else {
        console.warn("⚠️ No form data available to submit");
      }
      
      console.log("🔄 Proceeding with login success callback...");
      onLoginSuccess();
    } catch (err) {
      console.error("❌ Error in email login success handler:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Background circles for visual consistency */}
      <div className="absolute top-20 -right-12 w-64 h-64 bg-[#e72208]/10 rounded-full opacity-60"></div>
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-[#3E7B27]/10 rounded-full opacity-60"></div>
      <div className="absolute -bottom-20 left-1/4 w-56 h-56 bg-[#4D55CC]/10 rounded-full opacity-60"></div>
      
      <div className="w-full max-w-md z-10">
        {/* Logo and branding at the top */}
        <div className="text-center mb-6">
          <div className="font-bold text-2xl text-gray-800 flex items-center justify-center mb-2">
            <span className="inline-block h-3 w-3 bg-[#3E7B27] rounded-full mr-2"></span>
            Project H
          </div>
          <p className="text-gray-600">Your Personal Health & Fitness Platform</p>
        </div>
        
        {/* Back button */}
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            aria-label="Back to landing page"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Back to home</span>
          </button>
        )}
        
        <Card className="shadow-xl border-gray-100">
          <CardHeader className="text-center pb-3">
            <h2 className="text-2xl font-bold text-gray-800">Welcome to Project H</h2>
            <p className="text-gray-500">Sign in to continue to your dashboard</p>
          </CardHeader>
          
          <CardContent className="pb-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="font-medium text-sm">Login</TabsTrigger>
                <TabsTrigger value="signup" className="font-medium text-sm">Create Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-0 focus:outline-none">
                <EmailLoginForm 
                  onLoginSuccess={handleEmailLoginSuccess} 
                  loading={loading}
                  setLoading={setLoading}
                  setError={setError}
                />
              </TabsContent>
              
              <TabsContent value="signup" className="mt-0 focus:outline-none">
                <EmailSignUpForm 
                  onSignUpSuccess={handleEmailLoginSuccess}
                  loading={loading}
                  setLoading={setLoading}
                  setError={setError}
                />
              </TabsContent>
            </Tabs>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleGoogleSignIn} 
                disabled={loading} 
                variant="outline" 
                className="w-full border-gray-200 hover:bg-gray-50 transition-all"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 48 48" 
                  className="h-5 w-5 mr-2"
                >
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                <span className="text-gray-700">Google</span>
              </Button>
              
              <Button 
                onClick={handleFacebookSignIn} 
                disabled={loading} 
                variant="outline" 
                className="w-full border-gray-200 hover:bg-gray-50 transition-all"
              >
                <Facebook className="h-5 w-5 mr-2 text-[#4267B2]" />
                <span className="text-gray-700">Facebook</span>
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center pt-2 pb-6">
            <div className="text-xs text-gray-500 text-center">
              By signing in, you agree to our Terms and Privacy Policy
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;