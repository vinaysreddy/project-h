import React from 'react';

const ExerciseAvailabilityStep = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Weekly Exercise Availability</label>
              <p className="text-sm text-gray-600 mb-3">How many days per week can you realistically commit to working out?</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  '1-2 days/week (Low frequency)',
                  '3-4 days/week (Moderate frequency)',
                  '5-6 days/week (High frequency)',
                  '5+ days/week (Very high frequency)'
                ].map(option => (
                  <label 
                    key={option}
                    className={`
                      p-4 border rounded cursor-pointer transition
                      ${formData.weeklyExercise === option ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}
                    `}
                  >
                    <input 
                      type="radio" 
                      name="weeklyExercise" 
                      value={option} 
                      checked={formData.weeklyExercise === option} 
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <div>{option}</div>
                  </label>
                ))}
              </div>
            </div>
          </div>
  );
};

export default ExerciseAvailabilityStep;