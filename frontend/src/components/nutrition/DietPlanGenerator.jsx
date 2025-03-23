/* Component that handles the diet plan generation process
Shows loading and error states */

import React, { useState, useEffect } from 'react';
import useDietPlan from '../../hooks/useDietPlan';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Component that fetches and provides diet plan data
 * @param {Object} props - Component props
 * @param {Object} props.userData - User profile data
 * @param {Object} props.healthMetrics - User health metrics data
 * @param {Function} props.onDietPlanGenerated - Callback when diet plan is ready
 * @returns {JSX.Element} - Rendered component
 */
const DietPlanGenerator = ({ userData, healthMetrics, onDietPlanGenerated }) => {
  // Combine user data and health metrics for diet plan generation
  const dietPlanParams = {
    ...userData,
    ...healthMetrics,
    dietType: userData.dietPreference || 'balanced',
    foodRestrictions: userData.foodRestrictions || [],
    allergies: userData.allergies || []
  };

  // Fetch the diet plan using our custom hook
  const { dietPlan, loading, error, retry } = useDietPlan(dietPlanParams);

  // When diet plan is loaded, notify parent component
  useEffect(() => {
    if (dietPlan && !loading && !error) {
      onDietPlanGenerated(dietPlan);
    }
  }, [dietPlan, loading, error, onDietPlanGenerated]);

  // If the diet plan is loading, show a loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-white rounded-lg shadow-sm">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-[#3E7B27] animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-1">Generating Your Meal Plan</h3>
          <p className="text-sm text-gray-500">
            Crafting a personalized nutrition plan based on your goals and preferences...
          </p>
        </div>
      </div>
    );
  }

  // If there was an error, show an error state with retry option
  if (error) {
    return (
      <div className="flex justify-center items-center p-8 bg-white rounded-lg shadow-sm border border-red-100">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-1">Unable to Generate Meal Plan</h3>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={retry}
            className="px-4 py-2 bg-[#3E7B27] text-white rounded-md flex items-center mx-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // If no diet plan is available but no error/loading, show an empty state
  if (!dietPlan) {
    return (
      <div className="flex justify-center items-center p-8 bg-white rounded-lg shadow-sm">
        <div className="text-center">
          <p className="text-sm text-gray-500">No meal plan available yet</p>
        </div>
      </div>
    );
  }

  // The component doesn't render anything on success - it just passes data to the parent
  return null;
};

export default DietPlanGenerator;