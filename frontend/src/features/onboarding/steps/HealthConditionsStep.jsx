import React from 'react';

const HealthConditionsStep = ({ formData, handleInputChange }) => {
  // Health conditions with icons and categories
  const healthConditions = [
    { id: 'No conditions', icon: '✅', category: 'general' },
    { id: 'Diabetes', icon: '🩸', category: 'metabolic' },
    { id: 'High Blood Pressure', icon: '❤️', category: 'cardiovascular' },
    { id: 'Thyroid Issues', icon: '🧠', category: 'hormonal' },
    { id: 'PCOS/PCOD', icon: '🔄', category: 'hormonal' },
    { id: 'Heart Disease', icon: '💔', category: 'cardiovascular' },
    { id: 'Joint Pain/Arthritis', icon: '🦴', category: 'musculoskeletal' },
    { id: 'Asthma', icon: '🫁', category: 'respiratory' },
    { id: 'Recent Injury', icon: '🤕', category: 'musculoskeletal' }
  ];

  // Handle the special case of "No conditions"
  const handleNoConditionsChange = (e) => {
    if (e.target.checked) {
      // If "No conditions" is checked, uncheck all other conditions
      const event = {
        target: {
          name: 'healthConditions',
          value: ['No conditions']
        }
      };
      handleInputChange(event);
    } else if (formData.healthConditions.length === 1 && formData.healthConditions[0] === 'No conditions') {
      // If "No conditions" is the only one checked and being unchecked, set to empty array
      const event = {
        target: {
          name: 'healthConditions',
          value: []
        }
      };
      handleInputChange(event);
    }
  };

  // Handle regular condition changes
  const handleConditionChange = (condition, isChecked) => {
    let newConditions;
    
    if (condition === 'No conditions' && isChecked) {
      // If "No conditions" is checked, uncheck all others
      newConditions = ['No conditions'];
    } else {
      // Start with current conditions, removing "No conditions" if it's there
      newConditions = formData.healthConditions.filter(c => c !== 'No conditions');
      
      // Add or remove the condition
      if (isChecked) {
        newConditions.push(condition);
      } else {
        newConditions = newConditions.filter(c => c !== condition);
      }
    }
    
    const event = {
      target: {
        name: 'healthConditions',
        value: newConditions
      }
    };
    handleInputChange(event);
  };

  return (
    <div className="space-y-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Health Considerations</h2>
        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#e72208] via-[#3E7B27] to-[#4D55CC] rounded-full"></div>
        <p className="text-gray-600 mt-4">This helps us customize your fitness and nutrition plan with your health in mind</p>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Major Health Conditions</label>
            <p className="text-sm text-gray-600 mb-4">Do you have any existing medical conditions? Select all that apply.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {healthConditions.map((condition) => {
                const isChecked = formData.healthConditions.includes(condition.id);
                const isNoConditions = condition.id === 'No conditions';
                
                // Determine if this checkbox should be disabled
                const isDisabled = 
                  (isNoConditions ? false : formData.healthConditions.includes('No conditions')) || 
                  (isNoConditions && formData.healthConditions.length > 0 && !isChecked);
                
                return (
                  <label 
                    key={condition.id}
                    className={`
                      flex items-center p-3 border rounded-lg transition-all duration-200
                      ${isChecked 
                        ? 'border-[#4D55CC] bg-[#4D55CC]/5' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                      ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <input 
                      type="checkbox" 
                      name="healthConditions" 
                      value={condition.id} 
                      checked={isChecked} 
                      onChange={(e) => {
                        if (!isDisabled) {
                          if (isNoConditions) {
                            handleNoConditionsChange(e);
                          } else {
                            handleConditionChange(condition.id, e.target.checked);
                          }
                        }
                      }}
                      disabled={isDisabled}
                      className="sr-only"
                    />
                    <span className="inline-block text-xl mr-3">{condition.icon}</span>
                    <span className={`text-sm ${isChecked ? 'font-medium text-[#4D55CC]' : 'text-gray-700'}`}>
                      {condition.id}
                    </span>
                    {isChecked && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto text-[#4D55CC]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                );
              })}
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Other Health Considerations</label>
              <textarea 
                name="otherCondition" 
                value={formData.otherCondition || ''} 
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4D55CC]/30 focus:border-[#4D55CC] transition-all outline-none"
                placeholder="Please specify if you have any other conditions, allergies, or dietary restrictions"
                rows="3"
              />
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-start text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#e72208] mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p>
                  <span className="font-medium">Important:</span> This information helps personalize your fitness program, but is not a substitute for medical advice. Always consult with a healthcare professional before starting a new fitness program, especially if you have existing health conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthConditionsStep;