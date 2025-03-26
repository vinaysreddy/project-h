/* Component that handles the workout plan generation process
Shows loading and error states during plan creation */

import React, { useEffect } from 'react';
import useWorkoutPlan from '../hooks/useWorkoutPlan';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Component that fetches and provides workout plan data
 * @param {Object} props - Component props
 * @param {Object} props.userData - User profile data
 * @param {Object} props.healthMetrics - User health metrics data
 * @param {Function} props.onWorkoutPlanGenerated - Callback when workout plan is ready
 * @returns {JSX.Element} - Rendered component
 */
const WorkoutPlanGenerator = ({ userData, healthMetrics, onWorkoutPlanGenerated }) => {
  // Combine user data and health metrics for workout plan generation
  const workoutPlanParams = {
    ...userData,
    ...healthMetrics,
    fitnessLevel: userData.fitnessLevel || "Intermediate",
    workoutDaysPerWeek: userData.workoutDaysPerWeek || 3,
    workoutDuration: userData.workoutDuration || "30-45 minutes",
    preferredWorkoutDays: userData.preferredWorkoutDays || ["Monday", "Wednesday", "Friday"],
    healthConditions: userData.healthConditions || [],
    movementsToAvoid: userData.movementsToAvoid || []
  };

  // Fetch the workout plan using our custom hook
  const { workoutPlan, loading, error, retry } = useWorkoutPlan(workoutPlanParams);

  // When workout plan is loaded, notify parent component
  useEffect(() => {
    if (workoutPlan && !loading && !error) {
      onWorkoutPlanGenerated(workoutPlan);
    }
  }, [workoutPlan, loading, error, onWorkoutPlanGenerated]);

  // If the workout plan is loading, show a loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-white rounded-lg shadow-sm">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-[#e72208] animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-1">Generating Your Workout Plan</h3>
          <p className="text-sm text-gray-500">
            Creating a personalized fitness plan based on your goals and preferences...
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
          <h3 className="text-lg font-medium mb-1">Unable to Generate Workout Plan</h3>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={retry}
            className="px-4 py-2 bg-[#e72208] text-white rounded-md flex items-center mx-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // If no workout plan is available but no error/loading, show an empty state
  if (!workoutPlan) {
    return (
      <div className="flex justify-center items-center p-8 bg-white rounded-lg shadow-sm">
        <div className="text-center">
          <p className="text-sm text-gray-500">No workout plan available yet</p>
        </div>
      </div>
    );
  }

  // The component doesn't render anything on success - it just passes data to the parent
  return null;
};

export default WorkoutPlanGenerator;