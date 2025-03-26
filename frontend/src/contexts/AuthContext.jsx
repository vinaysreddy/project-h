import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
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

  // Sign in with Google and register with backend
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      // 1. Authenticate with Firebase
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      const uid = result.user.uid;
      
      // 2. Register with backend
      await axios.post(`${API_URL}/auth/signup`, {
        email: result.user.email,
        name: result.user.displayName,
        photoURL: result.user.photoURL,
        uid: uid
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // 3. Get user data from backend - pass the uid explicitly
      await fetchUserData(token, uid);
      
      return { 
        token, 
        user: result.user 
      };
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  }

  // Fetch user data from backend
  async function fetchUserData(tokenParam, uidParam) {
    try {
      // Handle case when this is called with no auth yet
      if (!currentUser && !uidParam) {
        console.log("No user authenticated yet");
        return null;
      }
      
      const token = tokenParam || await getToken();
      const uid = uidParam || currentUser.uid;
      
      const response = await axios.get(`${API_URL}/auth/user?uid=${uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUserProfile(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }

  // Fetch onboarding data
  async function fetchOnboardingData() {
    try {
      const token = await getToken();
      
      // Don't proceed if we don't have a token
      if (!token) {
        console.warn("Cannot fetch onboarding data without authentication");
        return null;
      }
      
      const response = await axios.get(`${API_URL}/onboarding`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setOnboardingData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching onboarding data:", error);
      return null;
    }
  }

  // Submit onboarding data
  async function submitOnboardingData(data) {
    try {
      const token = await getToken();
      
      const response = await axios.post(`${API_URL}/onboarding`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setOnboardingData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error submitting onboarding data:", error);
      throw error;
    }
  }

  // Update onboarding data
  async function updateOnboardingData(data) {
    try {
      const token = await getToken();
      
      const response = await axios.put(`${API_URL}/onboarding`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setOnboardingData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating onboarding data:", error);
      throw error;
    }
  }

  // Sign out
  function logout() {
    setUserProfile(null);
    setOnboardingData(null);
    return signOut(auth);
  }

  // Get current user's token
  async function getToken() {
    if (!currentUser) {
      console.warn('No authenticated user when trying to get token');
      return null;
    }
    
    try {
      return await currentUser.getIdToken(true);
    } catch (error) {
      console.error('Error getting user token:', error);
      throw error;
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Auto-fetch user data when signed in
          const token = await user.getIdToken();
          
          // First fetch user profile
          const userProfile = await fetchUserData(token, user.uid);
          
          // Only fetch onboarding data if we have a user profile
          if (userProfile) {
            await fetchOnboardingData();
          }
        } catch (error) {
          console.error("Error fetching initial data:", error);
        }
      } else {
        // Reset states when user is logged out
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