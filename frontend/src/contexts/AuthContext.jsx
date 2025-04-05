import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider, firebaseApp } from '../config/firebase';
import axios from 'axios';

const API_URL = 'http://localhost:3000';
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [onboardingData, setOnboardingData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get token
  async function getToken(forceRefresh = false) {
    console.log("🔑 Getting authentication token...");
    if (!currentUser) {
      console.log("❌ No current user found, cannot get token");
      return null;
    }
    try {
      const token = await currentUser.getIdToken(forceRefresh);
      // Print the full token string directly:
      console.log("Full token:", token);
      return token;
    } catch (error) {
      console.error("❌ Error getting token:", error);
      return null;
    }
  }

  // Sign in with Google and register with backend
  async function signInWithGoogle() {
    console.log("🔄 Starting Google authentication process...");
    try {
      const provider = googleProvider;
      console.log("🔄 Opening Google sign-in popup...");
      const result = await signInWithPopup(auth, provider);
      console.log("✅ Google authentication successful:", result.user.email);
      
      const token = await result.user.getIdToken();
      console.log("Full Google auth token:", token);
      const uid = result.user.uid;
      console.log("🔑 User ID:", uid);
      console.log("🔄 Registering user with backend...");
      
      // Register with backend
      const backendResponse = await axios.post(`${API_URL}/auth/signup`, {
        email: result.user.email,
        name: result.user.displayName,
        photoURL: result.user.photoURL,
        uid: uid
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log("✅ Backend registration successful", backendResponse.data);
      return { token, user: result.user };
    } catch (error) {
      console.error("❌ Authentication error:", error);
      console.error("❌ Error details:", error.code, error.message);
      throw error;
    }
  }

  // Sign up with email and password
  const signUpWithEmail = async (email, password) => {
    try {
      console.log("🔄 Starting email signup process...");
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ Email signup successful:", result.user.email);
      
      // Similar to Google auth, register with backend
      const token = await result.user.getIdToken();
      const uid = result.user.uid;
      
      console.log("🔄 Registering user with backend...");
      const backendResponse = await axios.post(`${API_URL}/auth/signup`, {
        email: result.user.email,
        name: result.user.email.split('@')[0], // Use email prefix as name
        photoURL: null,
        uid: uid,
        provider: 'password' // Indicate this is password-based auth
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log("✅ Backend registration successful", backendResponse.data);
      return result;
    } catch (error) {
      console.error("Error signing up with email:", error);
      throw error;
    }
  };

  // Sign in with email and password
  const signInWithEmail = async (email, password) => {
    try {
      console.log("🔄 Starting email authentication process...");
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Email authentication successful:", result.user.email);
      setCurrentUser(result.user);
      return result;
    } catch (error) {
      console.error("❌ Error signing in with email:", error);
      
      // Handle specific Firebase error codes with user-friendly messages
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        throw new Error("No account exists with this email. Please create an account first.");
      } else if (error.code === 'auth/wrong-password') {
        throw new Error("Incorrect password. Please try again or reset your password.");
      } else if (error.code === 'auth/invalid-email') {
        throw new Error("Invalid email format. Please check your email address.");
      } else if (error.code === 'auth/user-disabled') {
        throw new Error("This account has been disabled. Please contact support.");
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error("Too many failed login attempts. Please try again later or reset your password.");
      } else {
        // For any other errors, return a generic message
        throw new Error("Failed to sign in. Please check your credentials and try again.");
      }
    }
  };

  // Sign in with Facebook
  const signInWithFacebook = async () => {
    try {
      // Use the pre-created facebookProvider from your firebase.js file
      console.log("🔄 Starting Facebook authentication process...");
      const result = await signInWithPopup(auth, facebookProvider);
      console.log("✅ Facebook authentication successful:", result.user.email);
      
      const token = await result.user.getIdToken();
      const uid = result.user.uid;
      console.log("🔑 User ID:", uid);
      console.log("🔄 Registering user with backend...");
      
      // Register with backend
      const backendResponse = await axios.post(`${API_URL}/auth/signup`, {
        email: result.user.email,
        name: result.user.displayName,
        photoURL: result.user.photoURL,
        uid: uid,
        provider: 'facebook.com' // Specify the provider for the backend
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log("✅ Backend registration successful", backendResponse.data);
      return { token, user: result.user };
    } catch (error) {
      console.error("❌ Error signing in with Facebook:", error);
      throw error;
    }
  };

  // Fetch user data from backend
  async function fetchUserData() {
    console.log("🔄 Fetching user profile data from backend...");
    try {
      const token = await getToken();
      if (!token || !currentUser) {
        console.log("❌ Cannot fetch user data: Missing token or user");
        return null;
      }
      
      console.log(`🔄 GET request to: ${API_URL}/auth/user`);
      console.log(`🔄 Auth header: Bearer ${token.substring(0, 15)}...`);
      
      const response = await axios.get(`${API_URL}/auth/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log("✅ User data fetched successfully:", response.data);
      setUserProfile(response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching user data:", error?.message);
      if (error.response) {
        console.error("❌ Response status:", error.response.status);
        console.error("❌ Response data:", error.response.data);
      }
      return null;
    }
  }

  // Add this version of fetchOnboardingData that accepts a token parameter:

  async function fetchOnboardingData(directToken = null) {
    console.log("🔄 Fetching onboarding data from backend...");
    try {
      const token = directToken || await getToken();
      if (!token) {
        console.log("❌ Cannot fetch onboarding data: Missing token");
        return null;
      }
      
      console.log(`🔄 GET request to: ${API_URL}/onboarding`);
      const response = await axios.get(`${API_URL}/onboarding`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log("✅ Onboarding data fetched successfully:", response.data);
      if (!directToken) {
        // Only update state if this is part of normal flow
        setOnboardingData(response.data.data);
      }
      return response.data.data;
    } catch (error) {
      // Don't treat 404 as an error for new users
      if (error.response && error.response.status === 404) {
        console.log("ℹ️ No onboarding data found - new user");
        return null;
      }
      
      console.error("❌ Error fetching onboarding data:", error?.message);
      if (error.response) {
        console.error("❌ Response status:", error.response.status);
        console.error("❌ Response data:", error.response.data);
      }
      throw error;
    }
  }

  // Enhance the submitOnboardingData function with better debugging

  async function submitOnboardingData(data, token = null) {
    console.log("🔄 AuthContext: Submitting onboarding data to backend...", data);
    
    // Validate data has required fields
    if (!data || !data.dob || !data.gender || !data.height_in_cm || !data.weight_in_kg) {
      console.error("❌ AuthContext: Invalid onboarding data format:", data);
      console.error("❌ Required fields missing from onboarding data");
      throw new Error("Invalid data format - missing required fields");
    }
    
    try {
      // Use provided token OR get a new one
      const authToken = token || await getToken(true); // Force refresh token
      if (!authToken) {
        console.error("❌ AuthContext: Cannot submit onboarding data: No authentication token");
        throw new Error("Authentication required");
      }
      
      // Log the full request details
      console.log(`🔄 AuthContext: POST request to: ${API_URL}/onboarding`);
      console.log(`🔄 AuthContext: Using token: ${authToken.substring(0, 15)}...`);
      console.log(`🔄 AuthContext: Sending data:`, JSON.stringify(data, null, 2));
      
      const response = await axios.post(`${API_URL}/onboarding`, data, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      console.log("✅ AuthContext: Onboarding data submitted successfully:", response.data);
      
      // Important: Update the state with the response data
      if (response?.data?.data) {
        setOnboardingData(response.data.data);
      } else {
        setOnboardingData(data); // Fallback to the submitted data
      }
      
      return response.data.data || data;
    } catch (error) {
      console.error("❌ AuthContext: Error submitting onboarding data:", error);
      if (error.response) {
        console.error("❌ AuthContext: Response status:", error.response.status);
        console.error("❌ AuthContext: Response data:", error.response.data);
      } else if (error.request) {
        console.error("❌ AuthContext: No response received:", error.request);
      } else {
        console.error("❌ AuthContext: Error message:", error.message);
      }
      throw error;
    }
  }

  // Update onboarding data
  async function updateOnboardingData(data) {
    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication required");
      
      const response = await axios.put(`${API_URL}/onboarding`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setOnboardingData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating onboarding data:", error?.message);
      throw error;
    }
  }

  // Check if user has onboarding data
  async function hasCompletedOnboarding() {
    try {
      // This will return null if no onboarding data exists
      const data = await fetchOnboardingData();
      return data !== null;
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      return false;
    }
  }

  // Sign out
  function logout() {
    setUserProfile(null);
    setOnboardingData(null);
    return signOut(auth);
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userProfile = await fetchUserData();
          if (userProfile) {
            await fetchOnboardingData();
          }
        } catch (error) {
          console.error("Error fetching initial data:", error);
        }
      } else {
        setUserProfile(null);
        setOnboardingData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Add this function within AuthProvider
  async function checkAuthAndDataStatus() {
    try {
      console.log("🔄 Checking auth and data status...");
      // First check if we have an authenticated user
      if (!currentUser) {
        console.log("❌ No current user found");
        return { 
          authenticated: false,
          hasProfile: false,
          hasOnboarding: false 
        };
      }
      
      // Check if we need to fetch the profile
      let profile = userProfile;
      if (!profile) {
        console.log("🔄 User profile not in state, fetching...");
        profile = await fetchUserData();
      }
      
      // Check if we need to fetch onboarding data
      let onboarding = onboardingData;
      if (!onboarding) {
        console.log("🔄 Onboarding data not in state, fetching...");
        onboarding = await fetchOnboardingData();
      }
      
      return {
        authenticated: true,
        hasProfile: !!profile,
        hasOnboarding: !!onboarding
      };
    } catch (error) {
      console.error("❌ Error checking auth and data status:", error);
      return { 
        authenticated: !!currentUser,
        hasProfile: false,
        hasOnboarding: false,
        error: error.message
      };
    }
  }

  // Don't forget to add it to the context value
  const value = {
    currentUser,
    userProfile,
    onboardingData,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signInWithFacebook,
    logout,
    getToken,
    fetchUserData,
    fetchOnboardingData,
    submitOnboardingData,
    updateOnboardingData,
    hasCompletedOnboarding,
    checkAuthAndDataStatus  // Add this to the context
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}