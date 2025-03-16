// Unit Conversions
export const cmToInches = (cm) => {
  if (!cm) return '';
  const inches = cm / 2.54;
  const feet = Math.floor(inches / 12);
  const remainingInches = Math.round(inches % 12);
  return `${feet}'${remainingInches}"`;
};

export const inchesToCm = (feet, inches) => {
  if (feet === undefined || inches === undefined) return '';
  return (feet * 12 + inches) * 2.54;
};

export const kgToLbs = (kg) => {
  if (!kg) return '';
  return Math.round(kg * 2.205);
};

export const lbsToKg = (lbs) => {
  if (!lbs) return '';
  return Math.round(lbs / 2.205 * 10) / 10;
};

// Basic Body Composition Calculations
export const calculateBMI = (height, weight, heightUnit, weightUnit) => {
  if (!height || !weight) return 'N/A';
  const heightInMeters = heightUnit === 'cm' ? height / 100 : height * 0.0254;
  const weightInKg = weightUnit === 'kg' ? weight : weight / 2.205;
  const bmi = weightInKg / (heightInMeters * heightInMeters);
  return bmi.toFixed(1);
};

export const getBMICategory = (bmi) => {
  let category, color;
  
  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'bg-blue-500 text-white';
  } else if (bmi < 25) {
    category = 'Healthy Weight';
    color = 'bg-green-500 text-white';
  } else if (bmi < 30) {
    category = 'Overweight';
    color = 'bg-yellow-500 text-white';
  } else {
    category = 'Obese';
    color = 'bg-red-500 text-white';
  }
  
  return { category, color };
};

export const calculateHealthyWeightRange = (height, heightUnit) => {
  if (!height) return { min: 'N/A', max: 'N/A' };
  
  const heightInMeters = heightUnit === 'cm' ? height / 100 : height * 0.0254;
  const minWeight = (18.5 * heightInMeters * heightInMeters).toFixed(1);
  const maxWeight = (24.9 * heightInMeters * heightInMeters).toFixed(1);
  
  // Convert to lbs if needed
  if (heightUnit !== 'cm') {
    return {
      min: Math.round(minWeight * 2.205),
      max: Math.round(maxWeight * 2.205)
    };
  }
  
  return {
    min: Math.round(minWeight),
    max: Math.round(maxWeight)
  };
};

// Energy & Metabolic Calculations
export const calculateBMR = (height, weight, gender, dateOfBirth, heightUnit, weightUnit) => {
  if (!height || !weight || !gender || !dateOfBirth) return 'N/A';
  
  const heightInCm = heightUnit === 'cm' ? height : height * 2.54;
  const weightInKg = weightUnit === 'kg' ? weight : weight / 2.205;
  
  // Calculate age from date of birth
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  // Mifflin-St Jeor Equation
  let bmr;
  if (gender === 'Male') {
    bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + 5;
  } else {
    bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) - 161;
  }
  
  return Math.round(bmr);
};

export const calculateTDEE = (bmr, activityLevel) => {
  if (bmr === 'N/A') return 'N/A';
  
  let activityMultiplier;
  if (activityLevel.includes('Sedentary')) {
    activityMultiplier = 1.2;
  } else if (activityLevel.includes('Lightly Active')) {
    activityMultiplier = 1.375;
  } else if (activityLevel.includes('Moderately Active')) {
    activityMultiplier = 1.55;
  } else if (activityLevel.includes('Active')) {
    activityMultiplier = 1.725;
  } else if (activityLevel.includes('Very Active')) {
    activityMultiplier = 1.9;
  } else {
    return 'N/A';
  }
  
  return Math.round(bmr * activityMultiplier);
};

export const calculateCalorieTarget = (tdee, primaryGoal) => {
  if (!tdee || tdee === 'N/A') return 'N/A';

  const goalMultipliers = {
    '🔥 Lose Weight (Fat Loss)': 0.8,                      // 20% deficit
    '💪 Gain Muscle (Muscle Building & Hypertrophy)': 1.1, // 10% surplus
    '🏃 Improve Endurance & Cardiovascular Health': 0.95,  // 5% deficit
    '⚖️ Maintain Weight & Improve Body Composition': 1.0,  // Maintenance
    '🌱 General Wellness & Energy Boost': 1.0,             // Maintenance
  };

  const multiplier = goalMultipliers[primaryGoal] || 1.0;
  return Math.round(tdee * multiplier);
};

export const calculateMacros = (calorieTarget, primaryGoal) => {
  if (!calorieTarget || calorieTarget === 'N/A') {
    return { protein: 'N/A', carbs: 'N/A', fat: 'N/A' };
  }

  const macroRatios = {
    '🔥 Lose Weight (Fat Loss)': { protein: 0.35, carbs: 0.35, fat: 0.30 },
    '💪 Gain Muscle (Muscle Building & Hypertrophy)': { protein: 0.30, carbs: 0.45, fat: 0.25 },
    '🏃 Improve Endurance & Cardiovascular Health': { protein: 0.25, carbs: 0.55, fat: 0.20 },
    '⚖️ Maintain Weight & Improve Body Composition': { protein: 0.30, carbs: 0.40, fat: 0.30 },
    '🌱 General Wellness & Energy Boost': { protein: 0.30, carbs: 0.40, fat: 0.30 },
  };

  const defaultRatio = { protein: 0.30, carbs: 0.40, fat: 0.30 };
  const macros = macroRatios[primaryGoal] || defaultRatio;

  // Calculate calories for each macro
  const proteinCalories = calorieTarget * macros.protein;
  const carbCalories = calorieTarget * macros.carbs;
  const fatCalories = calorieTarget * macros.fat;

  // Convert calories to grams
  const proteinGrams = Math.round(proteinCalories / 4); // Protein: 4 calories/g
  const carbsGrams = Math.round(carbCalories / 4);      // Carbs: 4 calories/g
  const fatGrams = Math.round(fatCalories / 9);         // Fat: 9 calories/g

  return { protein: proteinGrams, carbs: carbsGrams, fat: fatGrams };
};

// Hydration & Wellness Calculations
export const calculateWaterIntake = (weight, weightUnit, activityLevel) => {
  if (!weight) return { amount: 'N/A', unit: 'liters' };
  
  // Convert to kg if needed
  const weightInKg = weightUnit === 'kg' ? weight : weight / 2.205;
  
  // Base calculation: 30-35ml per kg of body weight
  let waterInMl = weightInKg * 33;
  
  // Adjust for activity level
  if (activityLevel.includes('Moderately Active')) {
    waterInMl *= 1.1;
  } else if (activityLevel.includes('Active')) {
    waterInMl *= 1.2;
  } else if (activityLevel.includes('Very Active')) {
    waterInMl *= 1.3;
  }
  
  // Convert to liters and round
  const waterInLiters = Math.round(waterInMl / 100) / 10;
  
  return { amount: waterInLiters, unit: 'liters' };
};

export const calculateSleepRecommendation = (dateOfBirth, activityLevel) => {
  if (!dateOfBirth) return 'N/A';
  
  // Calculate age
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  // Base sleep recommendation by age
  let sleepHours;
  if (age < 18) {
    sleepHours = 9;
  } else if (age < 65) {
    sleepHours = 7.5;
  } else {
    sleepHours = 7;
  }
  
  // Adjust for activity level
  if (activityLevel.includes('Active') || activityLevel.includes('Very Active')) {
    sleepHours += 0.5;
  }
  
  return sleepHours;
};

// Fitness & Training Calculations
export const calculateCardioZones = (dateOfBirth) => {
  if (!dateOfBirth) {
    return {
      recovery: 'N/A',
      fatBurning: 'N/A',
      aerobic: 'N/A',
      anaerobic: 'N/A',
      maximum: 'N/A'
    };
  }
  
  // Calculate age
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  // Estimate max heart rate (220 - age)
  const maxHR = 220 - age;
  
  return {
    recovery: `${Math.round(maxHR * 0.5)}-${Math.round(maxHR * 0.6)}`,
    fatBurning: `${Math.round(maxHR * 0.6)}-${Math.round(maxHR * 0.7)}`,
    aerobic: `${Math.round(maxHR * 0.7)}-${Math.round(maxHR * 0.8)}`,
    anaerobic: `${Math.round(maxHR * 0.8)}-${Math.round(maxHR * 0.9)}`,
    maximum: `${Math.round(maxHR * 0.9)}-${maxHR}`
  };
};

export const getWorkoutRecommendation = (primaryGoal, weeklyExercise, healthConditions = []) => {
  // Default values
  let result = {
    frequency: '3-4 days per week',
    focus: 'Mixed Training',
    intensity: 'Moderate',
    restPeriods: '60-90 seconds',
    description: 'A balanced approach to fitness.',
    workoutPlan: [
      { focus: 'Full Body', description: 'Compound exercises for all major muscle groups' },
      { focus: 'Rest or Light Activity', description: 'Recovery or light walking/mobility work' },
      { focus: 'Cardio', description: '20-30 minutes of moderate intensity cardio' },
      { focus: 'Full Body', description: 'Compound exercises for all major muscle groups' },
      { focus: 'Rest', description: 'Complete recovery day' }
    ]
  };
  
  // Parse frequency from weeklyExercise
  const days = parseInt(weeklyExercise.split('/')[0]);
  const frequency = isNaN(days) ? '3-4 days per week' : `${days} days per week`;
  
  // Adjust recommendation based on primary goal
  if (primaryGoal.includes('Lose Weight')) {
    result = {
      frequency: frequency,
      focus: 'Mixed Training with Caloric Deficit',
      intensity: 'Moderate to High',
      restPeriods: '30-60 seconds',
      description: 'Focus on creating a caloric deficit with a mix of strength training to preserve muscle and cardio for calorie burning.',
      workoutPlan: [
        { focus: 'Full Body Strength', description: 'Compound movements with moderate weights' },
        { focus: 'HIIT Cardio', description: '20-30 minutes of high-intensity interval training' },
        { focus: 'Rest or Light Activity', description: 'Active recovery like walking or yoga' },
        { focus: 'Full Body Strength', description: 'Different exercises than Day 1, moderate weights' },
        { focus: 'Steady State Cardio', description: '30-45 minutes at moderate intensity' },
        { focus: 'Active Recovery', description: 'Light mobility work and stretching' },
        { focus: 'Rest', description: 'Complete rest day' }
      ]
    };
  } else if (primaryGoal.includes('Gain Muscle')) {
    result = {
      frequency: frequency,
      focus: 'Progressive Resistance Training',
      intensity: 'Moderate to High',
      restPeriods: '90-120 seconds',
      description: 'Focus on progressive overload with compound and isolation exercises, sufficient protein intake, and slight caloric surplus.',
      workoutPlan: [
        { focus: 'Upper Body Push', description: 'Chest, shoulders, and triceps' },
        { focus: 'Lower Body', description: 'Quadriceps, hamstrings, and calves' },
        { focus: 'Rest', description: 'Recovery day' },
        { focus: 'Upper Body Pull', description: 'Back and biceps' },
        { focus: 'Lower Body & Core', description: 'Legs, glutes, and abdominals' },
        { focus: 'Light Cardio & Mobility', description: '20-30 minutes of low-intensity cardio' },
        { focus: 'Rest', description: 'Complete rest day' }
      ]
    };
  } else if (primaryGoal.includes('Improve Endurance')) {
    result = {
      frequency: frequency,
      focus: 'Cardiovascular Training',
      intensity: 'Low to High (varied)',
      restPeriods: '15-30 seconds',
      description: 'Mix of steady-state cardio and interval training to improve cardiovascular endurance and efficiency.',
      workoutPlan: [
        { focus: 'Steady State Cardio', description: '40-60 minutes at moderate intensity' },
        { focus: 'Interval Training', description: '30 minutes of alternating high and low intensity' },
        { focus: 'Cross Training', description: 'Different cardio modality (e.g., swimming, cycling)' },
        { focus: 'Rest or Light Activity', description: 'Active recovery' },
        { focus: 'Long Duration Cardio', description: '60+ minutes at lower intensity' },
        { focus: 'Strength & Stability', description: 'Core and functional training to support endurance' },
        { focus: 'Rest', description: 'Complete rest day' }
      ]
    };
  } else if (primaryGoal.includes('Maintain Weight')) {
    result = {
      frequency: frequency,
      focus: 'Balanced Fitness Approach',
      intensity: 'Moderate',
      restPeriods: '60-90 seconds',
      description: 'Maintain current fitness with a balance of strength, cardio, and flexibility training.',
      workoutPlan: [
        { focus: 'Full Body Strength', description: 'Compound exercises for all major muscle groups' },
        { focus: 'Cardio', description: '30 minutes at moderate intensity' },
        { focus: 'Rest or Light Activity', description: 'Light mobility work or walking' },
        { focus: 'Split Strength Training', description: 'Upper body focus' },
        { focus: 'Split Strength Training', description: 'Lower body focus' },
        { focus: 'Flexibility & Mobility', description: 'Yoga, stretching, or mobility work' },
        { focus: 'Rest', description: 'Complete rest day' }
      ]
    };
  } else if (primaryGoal.includes('Wellness')) {
    result = {
      frequency: frequency,
      focus: 'Holistic Well-being',
      intensity: 'Low to Moderate',
      restPeriods: 'As needed',
      description: 'Focus on movement that feels good, reduces stress, and improves overall well-being.',
      workoutPlan: [
        { focus: 'Light Cardio', description: '30 minutes of walking, cycling, or swimming' },
        { focus: 'Yoga or Pilates', description: 'Body-weight strength and flexibility' },
        { focus: 'Rest', description: 'Recovery day' },
        { focus: 'Functional Strength', description: 'Full-body movements with light resistance' },
        { focus: 'Mindful Movement', description: 'Tai chi, qigong, or slow flow yoga' },
        { focus: 'Nature Activity', description: 'Hiking, gardening, or outdoor leisurely activity' },
        { focus: 'Rest', description: 'Complete rest day' }
      ]
    };
  }
  
  // Adjust for health conditions if needed
  if (healthConditions && healthConditions.length > 0) {
    if (healthConditions.includes('Joint Pain') || healthConditions.includes('Arthritis')) {
      result.intensity = 'Low to Moderate';
      result.description += ' Modified for joint protection with low-impact activities.';
    }
    
    if (healthConditions.includes('Heart Condition')) {
      result.intensity = 'Low';
      result.description += ' Carefully monitored intensity to keep heart rate in safe zones.';
    }
  }
  
  return result;
};

// Progress & Goal Tracking
export const calculateWeightProgress = (currentWeight, targetWeight) => {
  if (!currentWeight || !targetWeight) return null;
  
  const weightDifference = Math.abs(currentWeight - targetWeight);
  const direction = currentWeight > targetWeight ? 'to lose' : 'to gain';
  
  // Assume a healthy rate of 0.5-1% of body weight per week
  const weeklyRate = direction === 'to lose' ? 
    Math.round(currentWeight * 0.01 * 10) / 10 : 
    Math.round(currentWeight * 0.005 * 10) / 10;
  
  // Calculate percentage progress
  const totalChange = Math.abs(targetWeight - currentWeight);
  let startWeight;
  
  if (direction === 'to lose') {
    startWeight = Math.max(currentWeight, targetWeight);
    const progress = startWeight - currentWeight;
    const percentage = Math.round((progress / totalChange) * 100);
    return {
      percentage: Math.min(100, Math.max(0, percentage)),
      remaining: Math.round(weightDifference * 10) / 10,
      direction,
      rate: weeklyRate
    };
  } else {
    startWeight = Math.min(currentWeight, targetWeight);
    const progress = currentWeight - startWeight;
    const percentage = Math.round((progress / totalChange) * 100);
    return {
      percentage: Math.min(100, Math.max(0, percentage)),
      remaining: Math.round(weightDifference * 10) / 10,
      direction,
      rate: weeklyRate
    };
  }
};

export const generateWeightProjection = (currentWeight, targetWeight, primaryGoal, weightUnit) => {
  if (!currentWeight || !targetWeight) return [];
  
  const weightDifference = Math.abs(currentWeight - targetWeight);
  const isWeightLoss = currentWeight > targetWeight;
  
  // Determine appropriate rate based on goal
  let weeklyRatePercentage;
  if (isWeightLoss) {
    weeklyRatePercentage = primaryGoal.includes('Lose Weight') ? 0.01 : 0.005; // 1% or 0.5% for weight loss
  } else {
    weeklyRatePercentage = primaryGoal.includes('Gain Muscle') ? 0.005 : 0.0025; // 0.5% or 0.25% for weight gain
  }
  
  // Calculate how many weeks needed
  const weeklyRate = currentWeight * weeklyRatePercentage;
  const weeksNeeded = Math.ceil(weightDifference / weeklyRate);
  
  // Generate weekly projection data
  const projectionData = [];
  let currentWeightValue = currentWeight;
  
  for (let week = 0; week <= weeksNeeded; week++) {
    if (week === 0) {
      projectionData.push({
        week: `Week ${week}`,
        weight: parseFloat(currentWeightValue.toFixed(1))
      });
    } else {
      if (isWeightLoss) {
        currentWeightValue -= weeklyRate;
        // Don't go below target
        currentWeightValue = Math.max(currentWeightValue, targetWeight);
      } else {
        currentWeightValue += weeklyRate;
        // Don't go above target
        currentWeightValue = Math.min(currentWeightValue, targetWeight);
      }
      
      projectionData.push({
        week: `Week ${week}`,
        weight: parseFloat(currentWeightValue.toFixed(1))
      });
    }
  }
  
  return projectionData;
};

// User Engagement & Success Metrics
export const calculateSuccessProbability = (formData) => {
  // This is a simplified model. In a real app, this would be much more sophisticated
  let probability = 70; // Base probability
  
  // Realistic goal alignment
  if (formData.primaryGoal && formData.targetWeight) {
    const weightDiff = Math.abs(formData.weight - formData.targetWeight);
    const weightPercentage = (weightDiff / formData.weight) * 100;
    
    if (formData.primaryGoal.includes('Lose Weight') && weightPercentage > 20) {
      // Large weight loss goal reduces probability
      probability -= 10;
    } else if (formData.primaryGoal.includes('Gain Muscle') && weightPercentage > 15) {
      // Large muscle gain goal reduces probability
      probability -= 15;
    }
  }
  
  // Activity level alignment
  if (formData.activityLevel && formData.weeklyExercise) {
    const days = parseInt(formData.weeklyExercise.split('/')[0]) || 0;
    
    if (formData.activityLevel.includes('Very Active') && days < 4) {
      probability -= 10;
    } else if (formData.activityLevel.includes('Moderately Active') && days >= 4) {
      probability += 5;
    }
  }
  
  // Health conditions consideration
  if (formData.healthConditions && formData.healthConditions.length > 0) {
    probability -= 5 * Math.min(formData.healthConditions.length, 3);
  }
  
  // Ensure probability is between 0-100
  return Math.min(100, Math.max(0, Math.round(probability)));
};