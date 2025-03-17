import { 
    signInWithPopup, 
    signOut as firebaseSignOut,  // Rename the import
    onAuthStateChanged,
    getIdToken
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { createUserProfile, getUserProfile } from "./firestoreService";

// Sign in with Google
export const signInWithGoogle = async (formData) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Store onboarding data if provided
    if (formData) {
      await createUserProfile(result.user.uid, {
        ...formData,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      });
    }
    
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);  // Use the renamed import
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Get auth token for backend API calls
export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  
  return await getIdToken(user);
};

// Subscribe to auth state changes
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Get additional user data from Firestore
      try {
        const userData = await getUserProfile(user.uid);
        // Call callback with combined data
        callback({
          ...user,
          userData
        });
      } catch (error) {
        console.error("Error getting user data:", error);
        callback(user);
      }
    } else {
      callback(null);
    }
  });
};