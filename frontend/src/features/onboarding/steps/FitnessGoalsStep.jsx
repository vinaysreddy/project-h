import React from 'react';

const FitnessGoalsStep = ({ formData, handleInputChange }) => {
  // Goal options with enhanced descriptions and icons
  const fitnessGoals = [
    {
      id: 'lose_weight',
      icon: '🔥',
      title: 'Lose Weight',
      description: 'Burn fat and achieve a leaner physique',
      color: '#e72208' // red - fitness color
    },
    {
      id: 'gain_muscle',
      icon: '💪',
      title: 'Gain Muscle',
      description: 'Build strength and increase muscle mass',
      color: '#3E7B27' // green - nutrition color
    },
    {
      id: 'improve_endurance',
      icon: '🏃',
      title: 'Improve Endurance',
      description: 'Enhance cardiovascular health and stamina',
      color: '#4D55CC' // blue - sleep color
    },
    {
      id: 'maintain_weight',
      icon: '⚖️',
      title: 'Maintain & Tone',
      description: 'Sustain weight while improving body composition',
      color: '#8e44ad' // purple
    },
    {
      id: 'general_wellness',
      icon: '🌱',
      title: 'General Wellness',
      description: 'Boost energy and improve overall health',
      color: '#16a085' // teal
    }
  ];

  // Helper function to get selected goal metadata
  const getSelectedGoal = () => {
    return fitnessGoals.find(goal => goal.id === formData.primaryGoal) || fitnessGoals[0];
  };

  return (
    <div className="space-y-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <p className="text-gray-600 mt-4">Select the goal that best matches what you want to achieve</p>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Primary Fitness Goal</label>
            <div className="grid grid-cols-1 gap-3">
              {fitnessGoals.map(goal => (
                <label 
                  key={goal.id}
                  className={`
                    p-4 border rounded-lg transition-all duration-200 cursor-pointer
                    ${formData.primaryGoal === goal.id 
                      ? `border-[${goal.color}] bg-[${goal.color}]/5 shadow-sm` 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <input 
                    type="radio" 
                    name="primaryGoal" 
                    value={goal.id} 
                    checked={formData.primaryGoal === goal.id} 
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`
                      w-10 h-10 flex items-center justify-center rounded-full mr-4
                      ${formData.primaryGoal === goal.id 
                        ? `bg-[${goal.color}]/10 text-[${goal.color}]` 
                        : 'bg-gray-100'
                      }
                    `}>
                      <span className="text-xl">{goal.icon}</span>
                    </div>
                    <div>
                      <div className={`font-medium ${formData.primaryGoal === goal.id ? `text-[${goal.color}]` : 'text-gray-800'}`}>
                        {goal.title}
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">{goal.description}</div>
                    </div>
                    {formData.primaryGoal === goal.id && (
                      <div className="ml-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={goal.color}>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          {(formData.primaryGoal === 'lose_weight' || formData.primaryGoal === 'gain_muscle') && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Weight</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input 
                    type="number" 
                    name="targetWeight" 
                    value={formData.targetWeight || ''} 
                    onChange={handleInputChange}
                    className={`w-full p-3 pr-12 border border-gray-300 rounded-lg 
                      focus:ring-2 focus:ring-[${getSelectedGoal().color}]/30 
                      focus:border-[${getSelectedGoal().color}] 
                      transition-all outline-none`}
                    placeholder={formData.weightUnit === 'kg' ? 'Target weight in kg' : 'Target weight in lbs'}
                  />
                </div>
                <div className="w-24 p-3 text-center text-gray-500 bg-gray-50 border border-gray-300 rounded-lg">
                  {formData.weightUnit}
                </div>
              </div>
              
              {formData.targetWeight && formData.weight && (
                <div className="text-sm mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="font-medium text-gray-700 mb-1">Your Plan:</div>
                  {formData.primaryGoal === 'lose_weight' && parseInt(formData.weight) > parseInt(formData.targetWeight) && (
                    <div className="flex items-center text-[#e72208]">
                      <span className="inline-block h-2 w-2 rounded-full bg-[#e72208] mr-2"></span>
                      Lose {Math.abs(parseInt(formData.weight) - parseInt(formData.targetWeight))} {formData.weightUnit}
                    </div>
                  )}
                  {formData.primaryGoal === 'gain_muscle' && parseInt(formData.targetWeight) > parseInt(formData.weight) && (
                    <div className="flex items-center text-[#3E7B27]">
                      <span className="inline-block h-2 w-2 rounded-full bg-[#3E7B27] mr-2"></span>
                      Gain {Math.abs(parseInt(formData.targetWeight) - parseInt(formData.weight))} {formData.weightUnit}
                    </div>
                  )}
                  {((formData.primaryGoal === 'lose_weight' && parseInt(formData.weight) <= parseInt(formData.targetWeight)) || 
                    (formData.primaryGoal === 'gain_muscle' && parseInt(formData.targetWeight) <= parseInt(formData.weight))) && (
                    <div className="flex items-center text-gray-600">
                      <span className="inline-block h-2 w-2 rounded-full bg-gray-400 mr-2"></span>
                      Your target weight should be different from your current weight
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FitnessGoalsStep;