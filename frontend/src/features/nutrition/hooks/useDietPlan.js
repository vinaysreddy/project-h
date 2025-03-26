/* React hook to manage diet plan data fetching and state
Handles loading and error states */

import { useState, useEffect } from 'react';
import { fetchDietPlan } from '../services/nutritionService';
import { transformDietPlanData } from '../utils/nutritionDataFormatter';

/**
 * Custom hook to fetch and manage diet plan data
 * @param {Object} userData - User data including preferences
 * @returns {Object} - Diet plan state and control functions
 */
const useDietPlan = (userData = {}) => {
  const [rawDietPlan, setRawDietPlan] = useState(null);
  const [transformedDietPlan, setTransformedDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadDietPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the diet plan from the API
        const data = await fetchDietPlan(userData);
        setRawDietPlan(data);
        
        // Transform the data to the format needed by the UI
        const transformed = transformDietPlanData(data);
        setTransformedDietPlan(transformed);
      } catch (err) {
        console.error('Error in useDietPlan:', err);
        setError('Failed to load your diet plan. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDietPlan();
  }, [userData, retryCount]); // Reload when userData changes or retry is triggered

  // Function to manually retry loading the diet plan
  const retryLoading = () => {
    setRetryCount(prevCount => prevCount + 1);
  };

  return {
    dietPlan: transformedDietPlan,
    rawData: rawDietPlan,
    loading,
    error,
    retry: retryLoading
  };
};

export default useDietPlan;