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
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
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

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Step {currentStep} of 6: {
          currentStep === 1 ? "Basic Information" :
          currentStep === 2 ? "Body Measurements" :
          currentStep === 3 ? "Fitness Goals" :
          currentStep === 4 ? "Activity Level" :
          currentStep === 5 ? "Exercise Availability" :
          "Health Conditions"
        }</h2>

        {renderStep()}

        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button 
              onClick={prevStep}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          )}
          {currentStep < 6 ? (
            <button 
              onClick={nextStep}
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={!isStepValid()}
            >
              Next
            </button>
          ) : (
            <button 
              onClick={onSubmit}
              className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;