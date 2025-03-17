import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalInfoStep from './PersonalInfoStep';
import BodyMeasurementsStep from './BodyMeasurementsStep';
import FitnessGoalsStep from './FitnessGoalsStep';
import ActivityLevelStep from './ActivityLevelStep';
import ExerciseAvailabilityStep from './ExerciseAvailabilityStep';
import HealthConditionsStep from './HealthConditionsStep';
import { useAuth } from '../../context/AuthContext';
import { saveUserProfile } from '../../services/firestoreService';
import { signInWithGoogle } from '../../services/authService';

const OnboardingForm = ({ formData, setFormData, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'healthConditions') {
        // Handle health conditions checkboxes
        if (checked) {
          // Add the value to the array if it's not already included
          if (value === 'No conditions') {
            // If "No conditions" is selected, clear all other conditions
            setFormData({
              ...formData,
              healthConditions: ['No conditions']
            });
          } else {
            // If another condition is selected, remove "No conditions" if present
            const updatedConditions = [...formData.healthConditions.filter(c => c !== 'No conditions')];
            if (!updatedConditions.includes(value)) {
              updatedConditions.push(value);
            }
            setFormData({
              ...formData,
              healthConditions: updatedConditions
            });
          }
        } else {
          // Remove the value from the array
          setFormData({
            ...formData,
            healthConditions: formData.healthConditions.filter(condition => condition !== value)
          });
        }
      } else {
        // Handle other checkbox inputs
        setFormData({
          ...formData,
          [name]: checked
        });
      }
    } else {
      // Handle text/select inputs
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const nextStep = () => {
    if (currentStep < 6 && isStepValid()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // If user is already logged in, save their profile
      if (currentUser) {
        await saveUserProfile({
          ...formData,
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          onboardingCompleted: true,
          createdAt: new Date().toISOString()
        });
        
        if (onComplete) {
          onComplete(formData);
        }
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        // If not logged in, sign in with Google and save profile data
        await signInWithGoogle(formData);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Show error message to user
      alert('There was an error saving your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep 
                formData={formData} 
                handleInputChange={handleInputChange} 
              />;
      case 2:
        return <BodyMeasurementsStep 
                formData={formData} 
                handleInputChange={handleInputChange} 
              />;
      case 3:
        return <FitnessGoalsStep 
                formData={formData} 
                handleInputChange={handleInputChange} 
              />;
      case 4:
        return <ActivityLevelStep 
                formData={formData} 
                handleInputChange={handleInputChange} 
              />;
      case 5:
        return <ExerciseAvailabilityStep 
                formData={formData} 
                handleInputChange={handleInputChange} 
              />;
      case 6:
        return <HealthConditionsStep 
                formData={formData} 
                handleInputChange={handleInputChange} 
              />;
      default:
        return null;
    }
  };

  // Progress calculation
  const progress = ((currentStep - 1) / 5) * 100;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-2 text-center">Complete Your Profile</h2>
        <p className="text-center text-gray-600 mb-6">
          We'll use this information to personalize your experience
        </p>
        
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Step {currentStep} of 6</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm font-medium mt-2 text-center">
            {
              currentStep === 1 ? "Basic Information" :
              currentStep === 2 ? "Body Measurements" :
              currentStep === 3 ? "Fitness Goals" :
              currentStep === 4 ? "Activity Level" :
              currentStep === 5 ? "Exercise Availability" :
              "Health Conditions"
            }
          </div>
        </div>

        {renderStep()}

        <div className="mt-8 flex justify-between">
          {currentStep > 1 ? (
            <button 
              onClick={prevStep}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Back
            </button>
          ) : (
            <div></div> // Empty div to maintain layout with flex-between
          )}
          
          {currentStep < 6 ? (
            <button 
              onClick={nextStep}
              className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${
                isStepValid() ? '' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!isStepValid()}
            >
              Continue
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              className={`px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Submit and Continue'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;