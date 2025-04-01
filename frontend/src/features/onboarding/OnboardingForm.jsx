import React, { useState } from 'react';
import PersonalInfoStep from './steps/PersonalInfoStep';
import BodyMeasurementsStep from './steps/BodyMeasurementsStep';
import FitnessGoalsStep from './steps/FitnessGoalsStep';
import ActivityLevelStep from './steps/ActivityLevelStep';
import ExerciseAvailabilityStep from './steps/ExerciseAvailabilityStep';
import HealthConditionsStep from './steps/HealthConditionsStep';
import { ChevronLeft } from 'lucide-react';

const OnboardingForm = ({ formData, setFormData, onSubmit, onBackToLanding }) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Existing handlers remain the same
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
        return <PersonalInfoStep 
                 formData={formData} 
                 handleInputChange={handleInputChange} 
               />;
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

  // Define all steps info in a single array for easier management
  const steps = [
    { 
      name: "Basic Information", 
      description: "Tell us about yourself",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      name: "Body Measurements", 
      description: "Your physical details",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      name: "Fitness Goals", 
      description: "What you aim to achieve",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      name: "Activity Level", 
      description: "Your current lifestyle",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    { 
      name: "Exercise Availability", 
      description: "Time you can dedicate",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      name: "Health Conditions", 
      description: "Medical considerations",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    }
  ];

  const getStepName = () => steps[currentStep - 1].name;
  const getStepIcon = () => steps[currentStep - 1].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
      {/* Background circles for visual consistency with landing page */}
      <div className="absolute top-20 -right-12 w-64 h-64 bg-[#e72208]/10 rounded-full opacity-60"></div>
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-[#3E7B27]/10 rounded-full opacity-60"></div>
      <div className="absolute -bottom-20 left-1/4 w-56 h-56 bg-[#4D55CC]/10 rounded-full opacity-60"></div>
      
      <div className="w-full max-w-2xl z-10">
        
        {/* Back button */}
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            aria-label="Back to landing page"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Back to home</span>
          </button>
        )}
        
        {/* Better progress indicator with clickable steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-medium text-gray-800">Your Profile Setup</h3>
            <p className="text-sm font-medium text-gray-500">{Math.round((currentStep / 6) * 100)}% Complete</p>
          </div>
          <div className="overflow-hidden overflow-x-auto pb-2">
            <div className="flex space-x-0 min-w-max">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  {/* Connecting line */}
                  {index > 0 && (
                    <div 
                      className={`w-10 h-0.5 ${
                        index < currentStep ? 'bg-[#3E7B27]' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                  
                  {/* Step indicator */}
                  <div className="flex flex-col items-center relative group">
                    <button
                      onClick={() => index + 1 < currentStep && setCurrentStep(index + 1)}
                      disabled={index + 1 > currentStep}
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-2 
                        ${index + 1 === currentStep 
                          ? 'bg-[#3E7B27] border-[#3E7B27] text-white'
                          : index + 1 < currentStep
                            ? 'bg-white border-[#3E7B27] text-[#3E7B27]'
                            : 'bg-white border-gray-200 text-gray-400'
                        }
                        ${index + 1 < currentStep ? 'cursor-pointer hover:bg-[#3E7B27]/10' : ''}
                        transition-all duration-200
                      `}
                    >
                      {index + 1 < currentStep ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </button>
                    
                    {/* Step name tooltip */}
                    <div className={`
                      absolute top-12 bg-white text-gray-800 text-xs font-medium px-2 py-1 rounded shadow-md 
                      transform -translate-x-1/2 left-1/2 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all
                      ${index + 1 === currentStep ? 'opacity-100 visible' : ''}
                      pointer-events-none z-10 max-w-[120px] text-center whitespace-nowrap
                    `}>
                      {step.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Step header with icon */}
        <div className="bg-white rounded-t-2xl shadow-md border border-gray-100 p-6 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#3E7B27]/10 border border-[#3E7B27]/20 mb-4">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-[#3E7B27]">
              {getStepIcon()}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {getStepName()}
          </h2>
          <p className="text-gray-500 mt-1">
            {steps[currentStep - 1].description}
          </p>
          
          {/* Estimated time indicator */}
          <div className="inline-flex items-center mt-3 text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Takes about 30 seconds</span>
          </div>
        </div>
        
        {/* Form content */}
        <div className="bg-white rounded-b-2xl shadow-xl border border-gray-100 border-t-0 overflow-hidden">
          <div className="p-8">
            {renderStep()}
            
            {/* Navigation buttons - enhanced */}
            <div className="mt-10 flex justify-between pt-6 border-t border-gray-100">
              {currentStep > 1 ? (
                <button 
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all hover:shadow-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              ) : (
                <div></div> // Empty div to maintain flex spacing
              )}
              
              <div className="flex items-center text-sm text-gray-500">
                {currentStep < 6 && (
                  <>
                    <span className="mr-2">Step {currentStep} of 6</span>
                    {isStepValid() && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </>
                )}
              </div>
              
              {currentStep < 6 ? (
                <button 
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`px-8 py-3 rounded-lg text-white font-medium transition-all flex items-center ${
                    isStepValid() 
                      ? 'bg-[#3E7B27] hover:bg-[#346A21] hover:shadow-md' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Continue
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button 
                  onClick={onSubmit}
                  className="px-8 py-3 bg-[#3E7B27] text-white rounded-lg font-medium hover:bg-[#346A21] transition-all hover:shadow-md flex items-center"
                >
                  Complete Profile
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Encouraging message */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Your information helps us create a personalized health & fitness plan just for you.</p>
          <p className="mt-1">Don't worry, you can always update your details later!</p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;