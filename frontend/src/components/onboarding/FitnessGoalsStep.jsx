import React from 'react';

const FitnessGoalsStep = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Primary Fitness Goal</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  '🔥 Lose Weight (Fat Loss)',
                  '💪 Gain Muscle (Muscle Building & Hypertrophy)',
                  '⚖️ Maintain Weight & Improve Body Composition',
                  '🏋️ Build Strength (Increase Power & Strength)',
                  '🏃 Improve Endurance & Cardiovascular Health',
                  '🌱 General Wellness & Energy Boost'
                ].map(goal => (
                  <label 
                    key={goal}
                    className={`
                      p-4 border rounded cursor-pointer transition
                      ${formData.primaryGoal === goal ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}
                    `}
                  >
                    <input 
                      type="radio" 
                      name="primaryGoal" 
                      value={goal} 
                      checked={formData.primaryGoal === goal} 
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <div>{goal}</div>
                  </label>
                ))}
              </div>
            </div>
            
            {(formData.primaryGoal === '🔥 Lose Weight (Fat Loss)' || 
              formData.primaryGoal === '💪 Gain Muscle (Muscle Building & Hypertrophy)') && (
              <div>
                <label className="block text-sm font-medium mb-1">Target Weight</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    name="targetWeight" 
                    value={formData.targetWeight} 
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder={formData.weightUnit === 'kg' ? 'Target weight in kg' : 'Target weight in lbs'}
                  />
                  <span className="p-2 border rounded bg-gray-100">
                    {formData.weightUnit}
                  </span>
                </div>
              </div>
            )}
          </div>
  );
};

export default FitnessGoalsStep;