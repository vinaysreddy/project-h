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
      
      // Send user data and token to backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userData: formData,
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
        const onboardingResponse = await fetch('/api/user/onboarding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userData: formData
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