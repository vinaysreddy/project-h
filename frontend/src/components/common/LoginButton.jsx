import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const LoginButton = ({ onLoginSuccess, variant = "primary", className = "" }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async () => {
    try {
      setLoading(true);
      const user = await signInWithGoogle();
      
      // If onLoginSuccess callback is provided, call it
      if (onLoginSuccess) {
        onLoginSuccess(user);
      } else {
        // Otherwise, redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // You could add error handling UI here
    } finally {
      setLoading(false);
    }
  };
  
  // If user is already logged in, show a different button
  if (currentUser) {
    return (
      <button 
        onClick={() => navigate('/dashboard')}
        className={`${variant === 'outline' 
          ? 'border border-[#e72208] text-[#e72208] hover:bg-[#e72208] hover:bg-opacity-10' 
          : 'bg-[#e72208] text-white hover:bg-opacity-90'} 
          rounded-full transition-colors ${className}`}
      >
        Dashboard
      </button>
    );
  }
  
  // Login button for non-authenticated users
  return (
    <button 
      onClick={handleLogin}
      disabled={loading}
      className={`${variant === 'outline' 
        ? 'border border-[#e72208] text-[#e72208] hover:bg-[#e72208] hover:bg-opacity-10' 
        : 'bg-[#e72208] text-white hover:bg-opacity-90'} 
        rounded-full transition-colors ${className} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Signing in...' : 'Sign in with Google'}
    </button>
  );
};

export default LoginButton;