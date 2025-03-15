// Unit Conversations
export const cmToInches = (cm) => {
    if (!cm) return '';
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
  };
  
  export const kgToLbs = (kg) => {
    if (!kg) return '';
    return Math.round(kg * 2.205);
  };


// Main Calculations
export const calculateBMI = (height, weight, heightUnit, weightUnit) => {
    if (!height || !weight) return 'N/A';
    const heightInMeters = heightUnit === 'cm' ? height / 100 : height * 0.0254;
    const weightInKg = weightUnit === 'kg' ? weight : weight / 2.205;
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };
  
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
    
    let bmr;
    if (gender === 'Male') {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
    } else {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
    }
    
    return Math.round(bmr);
  };
  
  export const calculateTDEE = (bmr, activityLevel) => {
    if (bmr === 'N/A') return 'N/A';
    
    let activityMultiplier;
    switch (activityLevel) {
      case '1️⃣ Sedentary – Little to no exercise, mostly sitting all day':
        activityMultiplier = 1.2;
        break;
      case '2️⃣ Lightly Active – Light exercise 1-3 days per week':
        activityMultiplier = 1.375;
        break;
      case '3️⃣ Moderately Active – Moderate exercise 3-5 days per week':
        activityMultiplier = 1.55;
        break;
      case '4️⃣ Active – Intense exercise 6-7 days per week or physically active job':
        activityMultiplier = 1.725;
        break;
      case '5️⃣ Very Active – Highly strenuous exercise and physically demanding jobs':
        activityMultiplier = 1.9;
        break;
      default:
        return 'N/A';
    }
    
    return Math.round(bmr * activityMultiplier);
  };
  
  export const calculateCalorieTarget = (tdee, primaryGoal) => {
    if (tdee === 'N/A') return 'N/A';
    
    switch (primaryGoal) {
      case '🔥 Lose Weight (Fat Loss)':
        return Math.round(tdee * 0.8); // 20% deficit
      case '💪 Gain Muscle (Muscle Building & Hypertrophy)':
        return Math.round(tdee * 1.1); // 10% surplus
      case '⚖️ Maintain Weight & Improve Body Composition':
        return tdee;
      case '🏋️ Build Strength (Increase Power & Strength)':
        return Math.round(tdee * 1.1); // 10% surplus
      case '🏃 Improve Endurance & Cardiovascular Health':
        return Math.round(tdee * 0.9); // 10% deficit
      case '🌱 General Wellness & Energy Boost':
        return tdee;
      default:
        return 'N/A';
    }
  };
  
  export const calculateMacros = (calorieTarget, primaryGoal) => {
    if (calorieTarget === 'N/A') return { protein: 'N/A', carbs: 'N/A', fat: 'N/A' };
    
    let proteinPercentage, carbPercentage, fatPercentage;
    
    switch (primaryGoal) {
      case '🔥 Lose Weight (Fat Loss)':
        proteinPercentage = 0.35; // 35%
        fatPercentage = 0.35; // 35%
        carbPercentage = 0.3; // 30%
        break;
      case '💪 Gain Muscle (Muscle Building & Hypertrophy)':
        proteinPercentage = 0.3; // 30%
        carbPercentage = 0.45; // 45%
        fatPercentage = 0.25; // 25%
        break;
      case '⚖️ Maintain Weight & Improve Body Composition':
        proteinPercentage = 0.3; // 30%
        carbPercentage = 0.4; // 40%
        fatPercentage = 0.3; // 30%
        break;
      case '🏋️ Build Strength (Increase Power & Strength)':
        proteinPercentage = 0.3; // 30%
        carbPercentage = 0.4; // 40%
        fatPercentage = 0.3; // 30%
        break;
      case '🏃 Improve Endurance & Cardiovascular Health':
        proteinPercentage = 0.25; // 25%
        carbPercentage = 0.55; // 55%
        fatPercentage = 0.2; // 20%
        break;
      case '🌱 General Wellness & Energy Boost':
        proteinPercentage = 0.25; // 25%
        carbPercentage = 0.5; // 50%
        fatPercentage = 0.25; // 25%
        break;
      default:
        return { protein: 'N/A', carbs: 'N/A', fat: 'N/A' };
    }
    
    const proteinCalories = calorieTarget * proteinPercentage;
    const carbCalories = calorieTarget * carbPercentage;
    const fatCalories = calorieTarget * fatPercentage;
    
    // Convert calories to grams
    const proteinGrams = Math.round(proteinCalories / 4); // 4 calories per gram of protein
    const carbGrams = Math.round(carbCalories / 4); // 4 calories per gram of carbs
    const fatGrams = Math.round(fatCalories / 9); // 9 calories per gram of fat
    
    return { protein: proteinGrams, carbs: carbGrams, fat: fatGrams };
  };