/* Handles API calls to fetch workout plans
Contains mock workout data for development */

import axios from 'axios';

/**
 * Fetches a workout plan from the API
 * @param {Object} userData - User data and preferences
 * @returns {Promise<Object>} - The workout plan data
 */
export const fetchWorkoutPlan = async (userData) => {
  try {
    // Prepare the request payload
    const payload = {
      days_per_week: userData.workoutDaysPerWeek,
      preferred_days: userData.preferredWorkoutDays || ["Monday", "Wednesday", "Friday"],
      session_duration: userData.workoutDuration || "30-45 minutes",
      workout_environments: userData.workoutEnvironments || ["Home", "Gym"],
      equipment_access: userData.equipmentAccess || ["Free weights", "Resistance bands/suspension trainers"],
      health_conditions: userData.healthConditions || [],
      movements_to_avoid: userData.movementsToAvoid || [],
      goal_timeline: userData.goalTimeline || "Within 3-6 months (Moderate)",
      fitness_level: userData.fitnessLevel || "Intermediate",
      fitness_goal: mapFitnessGoal(userData.primaryGoal)
    };

    // Make the API call
    const response = await axios.post('http://localhost:3000/api/generate-workout', payload);
    
    // Return the data
    return response.data;
  } catch (error) {
    console.error('Error fetching workout plan:', error);
    // For development, return mock data when API fails
    return getMockWorkoutPlanData();
  }
};

/**
 * Maps the user's primary goal to the API's expected format
 */
const mapFitnessGoal = (goal) => {
  switch (goal?.toLowerCase()) {
    case 'lose weight':
    case 'fat loss':
      return 'Fat loss and improved conditioning';
    case 'build muscle':
      return 'Increase strength and improve muscle definition';
    case 'improve fitness':
      return 'Improve overall fitness and endurance';
    case 'maintain weight':
    case 'maintain':
      return 'General fitness and maintenance';
    default:
      return 'General fitness';
  }
};

/**
 * Mock data to use during development or when the API fails
 */
export const getMockWorkoutPlanData = () => {
  return {
    "workout_plan": {
      "days": [
        {
          "day": 1,
          "focus": "Push",
          "duration": "40 minutes",
          "warmup": [
            "5 minutes light cardio (jumping jacks, high knees, jogging in place)",
            "10 arm circles each direction",
            "10 body weight squats"
          ],
          "exercises": [
            {
              "name": "Push-ups",
              "sets": 3,
              "reps": "8-12",
              "rest": "60 seconds",
              "notes": "Keep core tight, lower chest to floor with elbows at 45° angle",
              "progression": {
                "easier": "Wall push-ups or knee push-ups",
                "harder": "Decline push-ups or add resistance band"
              }
            },
            {
              "name": "Dumbbell Shoulder Press",
              "sets": 3,
              "reps": "10-12",
              "rest": "60-90 seconds",
              "notes": "Start with weights at shoulder level, press overhead without locking elbows",
              "progression": {
                "easier": "Seated shoulder press with lighter weights",
                "harder": "Standing single-arm press or increase weight"
              }
            },
            {
              "name": "Tricep Dips",
              "sets": 3,
              "reps": "10-15",
              "rest": "60 seconds",
              "notes": "Use a chair or low table, keep elbows close to body",
              "progression": {
                "easier": "Bend knees to reduce load",
                "harder": "Extend legs straight or add weight"
              }
            }
          ],
          "cooldown": [
            "Chest stretch (30 seconds per side)",
            "Tricep stretch (30 seconds per side)",
            "Child's pose (30 seconds)"
          ]
        },
        {
          "day": 3,
          "focus": "Pull",
          "duration": "40 minutes",
          "warmup": [
            "5 minutes of brisk walking or light jogging",
            "10 shoulder rolls each direction",
            "10 cat-cow stretches"
          ],
          "exercises": [
            {
              "name": "Bent-over Dumbbell Rows",
              "sets": 3,
              "reps": "10-12",
              "rest": "60 seconds",
              "notes": "Keep back straight, pull weights towards hips",
              "progression": {
                "easier": "Use lighter weights",
                "harder": "Single-arm rows or increase weight"
              }
            },
            {
              "name": "Resistance Band Face Pulls",
              "sets": 3,
              "reps": "12-15",
              "rest": "60 seconds",
              "notes": "Pull band towards face, keep elbows high",
              "progression": {
                "easier": "Use lighter resistance band",
                "harder": "Increase resistance or reps"
              }
            },
            {
              "name": "Bicep Curls",
              "sets": 3,
              "reps": "10-15",
              "rest": "60 seconds",
              "notes": "Keep elbows close to body, curl weight up",
              "progression": {
                "easier": "Use lighter weights",
                "harder": "Increase weight or do hammer curls"
              }
            }
          ],
          "cooldown": [
            "Shoulder stretch (30 seconds per side)",
            "Upper back stretch (30 seconds)",
            "Neck stretch (30 seconds per side)"
          ]
        },
        {
          "day": 5,
          "focus": "Legs",
          "duration": "40 minutes",
          "warmup": [
            "5 minutes of light cardio (marching in place, butt kickers)",
            "10 leg swings each leg",
            "10 hip circles each direction"
          ],
          "exercises": [
            {
              "name": "Bodyweight Squats",
              "sets": 3,
              "reps": "15-20",
              "rest": "60 seconds",
              "notes": "Keep chest up, push through heels",
              "progression": {
                "easier": "Squat to chair",
                "harder": "Add dumbbells or resistance band"
              }
            },
            {
              "name": "Lunges",
              "sets": 3,
              "reps": "10-12 each leg",
              "rest": "60 seconds",
              "notes": "Step forward, keep front knee over ankle",
              "progression": {
                "easier": "Reduce range of motion",
                "harder": "Add weights or perform walking lunges"
              }
            },
            {
              "name": "Glute Bridges",
              "sets": 3,
              "reps": "15-20",
              "rest": "60 seconds",
              "notes": "Squeeze glutes at top, keep feet flat",
              "progression": {
                "easier": "Single leg glute bridge",
                "harder": "Add weight to hips"
              }
            }
          ],
          "cooldown": [
            "Quad stretch (30 seconds per side)",
            "Hamstring stretch (30 seconds per side)",
            "Calf stretch (30 seconds per side)"
          ]
        }
      ],
      "progression_notes": "To progress this plan, first increase reps to the upper end of ranges, then add sets, then increase resistance. Aim to increase either reps, sets, or resistance every 1-2 weeks."
    }
  };
};

export default {
  fetchWorkoutPlan,
  getMockWorkoutPlanData
};