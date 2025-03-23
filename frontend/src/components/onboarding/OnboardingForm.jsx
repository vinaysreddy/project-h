import React, { useState } from 'react';
import PersonalInfoStep from './PersonalInfoStep';
import BodyMeasurementsStep from './BodyMeasurementsStep';
import FitnessGoalsStep from './FitnessGoalsStep';
import ActivityLevelStep from './ActivityLevelStep';
import ExerciseAvailabilityStep from './ExerciseAvailabilityStep';
import HealthConditionsStep from './HealthConditionsStep';

const OnboardingForm = ({ formData, setFormData, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (checked) {
        setFormData({
          ...formData,
          healthConditions: [...formData.healthConditions, value]
        });
      } else {
        setFormData({
          ...formData,
          healthConditions: formData.healthConditions.filter(condition => condition !== value)
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    // Scroll to top when moving to next step
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    // Scroll to top when moving to previous step
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.dateOfBirth && formData.gender;
      case 2:
        return formData.height && formData.weight;
      case 3:
        return formData.primaryGoal;
      case 4:
        return formData.activityLevel;
      case 5:
        return formData.weeklyExercise;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep formData={formData} handleInputChange={handleInputChange} />;
      case 2:
        return <BodyMeasurementsStep formData={formData} handleInputChange={handleInputChange} />;
      case 3:
        return <FitnessGoalsStep formData={formData} handleInputChange={handleInputChange} />;
      case 4:
        return <ActivityLevelStep formData={formData} handleInputChange={handleInputChange} />;
      case 5:
        return <ExerciseAvailabilityStep formData={formData} handleInputChange={handleInputChange} />;
      case 6:
        return <HealthConditionsStep formData={formData} handleInputChange={handleInputChange} />;
      default:
        return null;
    }
  };

  const getStepName = () => {
    switch (currentStep) {
      case 1: return "Basic Information";
      case 2: return "Body Measurements";
      case 3: return "Fitness Goals";
      case 4: return "Activity Level";
      case 5: return "Exercise Availability";
      case 6: return "Health Conditions";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* Simple progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-gray-500">Progress</p>
            <p className="text-sm font-medium text-gray-500">{currentStep}/6</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#e72208] via-[#3E7B27] to-[#4D55CC] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Step title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {getStepName()}
          </h2>
        </div>
        
        {/* Form content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            {renderStep()}
            
            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between pt-6 border-t border-gray-100">
              {currentStep > 1 ? (
                <button 
                  onClick={prevStep}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}
              
              {currentStep < 6 ? (
                <button 
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`px-5 py-2.5 rounded-lg text-white transition-colors
                    ${isStepValid() 
                      ? 'bg-gradient-to-r from-[#e72208] via-[#3E7B27] to-[#4D55CC] hover:opacity-90' 
                      : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                  Continue
                </button>
              ) : (
                <button 
                  onClick={onSubmit}
                  className="px-5 py-2.5 bg-[#3E7B27] text-white rounded-lg hover:bg-[#3E7B27]/90 transition-colors"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;