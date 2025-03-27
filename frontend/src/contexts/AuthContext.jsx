import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../services/firebase/config';
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
  async function getToken() {
    console.log("🔑 Getting authentication token...");
    if (!currentUser) {
      console.log("❌ No current user found, cannot get token");
      return null;
    }
    try {
      const token = await currentUser.getIdToken(true);
      console.log(token);
      console.log("✅ Token retrieved successfully", token.substring(0, 15) + "...");
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
      const provider = new GoogleAuthProvider();
      console.log("🔄 Opening Google sign-in popup...");
      const result = await signInWithPopup(auth, provider);
      console.log("✅ Google authentication successful:", result.user.email);
      
      const token = await result.user.getIdToken();
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

  // Fetch onboarding data
  async function fetchOnboardingData() {
    console.log("🔄 Fetching onboarding data from backend...");
    try {
      const token = await getToken();
      if (!token) {
        console.log("❌ Cannot fetch onboarding data: Missing token");
        return null;
      }
      
      console.log(`🔄 GET request to: ${API_URL}/onboarding`);
      const response = await axios.get(`${API_URL}/onboarding`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log("✅ Onboarding data fetched successfully:", response.data);
      setOnboardingData(response.data.data); // Note: response includes {message, data}
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
      return null;
    }
  }

  async function submitOnboardingData(data, token = null) {
    console.log("🔄 Submitting onboarding data to backend...", data);
    try {
      // Use provided token OR get a new one
      const authToken = token || await getToken();
      if (!authToken) {
        console.error("❌ Cannot submit onboarding data: No authentication token");
        throw new Error("Authentication required");
      }
      
      console.log(`🔄 POST request to: ${API_URL}/onboarding`);
      const response = await axios.post(`${API_URL}/onboarding`, data, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      console.log("✅ Onboarding data submitted successfully:", response.data);
      setOnboardingData(data);
      return data;
    } catch (error) {
      if (error.response) {
        console.error("❌ Response status:", error.response.status);
        console.error("❌ Response data:", error.response.data);
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

  const value = {
    currentUser,
    userProfile,
    onboardingData,
    signInWithGoogle,
    logout,
    getToken,
    fetchUserData,
    fetchOnboardingData,
    submitOnboardingData,
    updateOnboardingData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}