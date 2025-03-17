import { 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    collection, 
    addDoc,
    query, 
    where, 
    getDocs,
    serverTimestamp 
  } from "firebase/firestore";
  import { db } from "../config/firebase";
  
  // Create or update user profile
  export const createUserProfile = async (userId, userData) => {
    try {
      const userRef = doc(db, "users", userId);
      
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  };
  
  // Get user profile
  export const getUserProfile = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const snapshot = await getDoc(userRef);
      
      if (snapshot.exists()) {
        return snapshot.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  };
  
  // Update user profile
  export const updateUserProfile = async (userId, data) => {
    try {
      const userRef = doc(db, "users", userId);
      
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };
  
  // Save fitness data
  export const saveFitnessData = async (userId, fitnessData) => {
    try {
      const fitnessRef = collection(db, "users", userId, "fitness");
      
      await addDoc(fitnessRef, {
        ...fitnessData,
        createdAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error("Error saving fitness data:", error);
      throw error;
    }
  };
  
  // Get user's fitness data
  export const getFitnessData = async (userId) => {
    try {
      const fitnessRef = collection(db, "users", userId, "fitness");
      const snapshot = await getDocs(fitnessRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting fitness data:", error);
      throw error;
    }
  };