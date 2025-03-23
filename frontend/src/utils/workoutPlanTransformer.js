/**
 * Transforms the API workout plan data into a format suitable for the UI
 * @param {Object} apiData - Workout plan data from the API
 * @returns {Object} - Transformed workout plan data
 */
export const transformWorkoutPlanData = (apiData) => {
    if (!apiData || !apiData.workout_plan || !apiData.workout_plan.days) {
      return null;
    }
  
    const workoutDays = apiData.workout_plan.days.map(day => {
      // Map day number to weekday name (assuming 1=Monday, etc.)
      const dayName = mapDayNumberToName(day.day);
      
      // Calculate workout metrics
      const totalSets = day.exercises.reduce((total, exercise) => total + exercise.sets, 0);
      const avgReps = calculateAverageReps(day.exercises);
      const totalExercises = day.exercises.length;
      const estimatedCalories = estimateCaloriesBurned(day.duration, day.focus);
      
      return {
        id: `day${day.day}`,
        dayNumber: day.day,
        dayName: dayName,
        focus: day.focus,
        duration: day.duration,
        warmup: day.warmup,
        exercises: day.exercises.map(exercise => ({
          ...exercise,
          muscleGroups: getMuscleGroups(exercise.name, day.focus)
        })),
        cooldown: day.cooldown,
        metrics: {
          totalSets,
          avgReps,
          totalExercises,
          estimatedCalories
        }
      };
    });
    
    return {
      days: workoutDays,
      progressionNotes: apiData.workout_plan.progression_notes
    };
  };
  
  /**
   * Map numeric day to weekday name
   */
  const mapDayNumberToName = (dayNumber) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    // Adjust for 0-based indexing
    return days[(dayNumber - 1) % 7];
  };
  
  /**
   * Calculate average reps from rep ranges
   */
  const calculateAverageReps = (exercises) => {
    if (!exercises.length) return 0;
    
    let totalAvgReps = 0;
    
    exercises.forEach(exercise => {
      // Handle rep ranges like "8-12" or single values like "15"
      if (typeof exercise.reps === 'string') {
        const repsParts = exercise.reps.split('-');
        if (repsParts.length === 2) {
          // It's a range, calculate average
          const min = parseInt(repsParts[0], 10);
          const max = parseInt(repsParts[1], 10);
          if (!isNaN(min) && !isNaN(max)) {
            totalAvgReps += (min + max) / 2;
          }
        } else {
          // It's a single value
          const reps = parseInt(exercise.reps, 10);
          if (!isNaN(reps)) {
            totalAvgReps += reps;
          }
        }
      } else if (typeof exercise.reps === 'number') {
        totalAvgReps += exercise.reps;
      }
    });
    
    return Math.round(totalAvgReps / exercises.length);
  };
  
  /**
   * Estimate calories burned based on workout duration and type
   */
  const estimateCaloriesBurned = (duration, focus) => {
    // Extract minutes from duration string
    const minutes = parseInt(duration, 10) || 40; // Default to 40 if parsing fails
    
    // Base calories per minute based on focus type
    let caloriesPerMinute;
    
    switch (focus.toLowerCase()) {
      case 'legs':
        caloriesPerMinute = 9.5; // Higher for leg workouts (larger muscles)
        break;
      case 'push':
      case 'pull':
        caloriesPerMinute = 8; // Medium for upper body
        break;
      case 'core':
        caloriesPerMinute = 7; // Lower for core
        break;
      case 'cardio':
        caloriesPerMinute = 11; // Highest for cardio
        break;
      default:
        caloriesPerMinute = 8; // Default
    }
    
    // Calculate total and add a bit of randomization
    const baseCals = minutes * caloriesPerMinute;
    const randomFactor = 0.9 + (Math.random() * 0.2); // Between 0.9 and 1.1
    
    return Math.round(baseCals * randomFactor);
  };
  
  /**
   * Get muscle groups targeted by an exercise
   */
  const getMuscleGroups = (exerciseName, focusDay) => {
    // This is a simplified mapping - in a real app, you'd have a more comprehensive database
    const exerciseMuscleMap = {
      'Push-ups': ['Chest', 'Shoulders', 'Triceps'],
      'Dumbbell Shoulder Press': ['Shoulders', 'Triceps'],
      'Tricep Dips': ['Triceps', 'Chest'],
      'Bent-over Dumbbell Rows': ['Back', 'Biceps'],
      'Resistance Band Face Pulls': ['Shoulders', 'Upper Back'],
      'Bicep Curls': ['Biceps'],
      'Bodyweight Squats': ['Quads', 'Glutes', 'Hamstrings'],
      'Lunges': ['Quads', 'Glutes', 'Hamstrings'],
      'Glute Bridges': ['Glutes', 'Hamstrings']
    };
    
    // If we have a direct mapping, use it
    if (exerciseMuscleMap[exerciseName]) {
      return exerciseMuscleMap[exerciseName];
    }
    
    // Otherwise, make an educated guess based on the focus day
    switch (focusDay.toLowerCase()) {
      case 'push':
        return ['Chest', 'Shoulders', 'Triceps'];
      case 'pull':
        return ['Back', 'Biceps'];
      case 'legs':
        return ['Quads', 'Hamstrings', 'Glutes'];
      case 'core':
        return ['Abs', 'Lower Back'];
      default:
        return ['Multiple muscle groups'];
    }
  };
  
  export default {
    transformWorkoutPlanData
  };