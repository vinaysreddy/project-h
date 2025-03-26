/* React hook to manage workout plan data fetching and state
Handles loading/error states for workout data
 */

import { useState, useEffect } from 'react';
import { fetchWorkoutPlan } from '../services/workoutService';
import { transformWorkoutPlanData } from '../utils/workoutDataFormatter';

/**
 * Custom hook to fetch and manage workout plan data
 * @param {Object} userData - User data including preferences
 * @returns {Object} - Workout plan state and control functions
 */
const useWorkoutPlan = (userData = {}) => {
  const [rawWorkoutPlan, setRawWorkoutPlan] = useState(null);
  const [transformedWorkoutPlan, setTransformedWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadWorkoutPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the workout plan from the API
        const data = await fetchWorkoutPlan(userData);
        setRawWorkoutPlan(data);
        
        // Transform the data to the format needed by the UI
        const transformed = transformWorkoutPlanData(data);
        setTransformedWorkoutPlan(transformed);
      } catch (err) {
        console.error('Error in useWorkoutPlan:', err);
        setError('Failed to load your workout plan. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadWorkoutPlan();
  }, [userData, retryCount]); // Reload when userData changes or retry is triggered

  // Function to manually retry loading the workout plan
  const retryLoading = () => {
    setRetryCount(prevCount => prevCount + 1);
  };

  return {
    workoutPlan: transformedWorkoutPlan,
    rawData: rawWorkoutPlan,
    loading,
    error,
    retry: retryLoading
  };
};

export default useWorkoutPlan;