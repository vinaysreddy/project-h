import React from 'react';

const ActivityLevelStep = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Daily Activity Level</label>
              <div className="space-y-3">
                {[
                  '1️⃣ Sedentary – Little to no exercise, mostly sitting all day',
                  '2️⃣ Lightly Active – Light exercise 1-3 days per week',
                  '3️⃣ Moderately Active – Moderate exercise 3-5 days per week',
                  '4️⃣ Active – Intense exercise 6-7 days per week or physically active job',
                  '5️⃣ Very Active – Highly strenuous exercise and physically demanding jobs'
                ].map(level => (
                  <label 
                    key={level}
                    className={`
                      block p-3 border rounded cursor-pointer transition
                      ${formData.activityLevel === level ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}
                    `}
                  >
                    <input 
                      type="radio" 
                      name="activityLevel" 
                      value={level} 
                      checked={formData.activityLevel === level} 
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <div>{level}</div>
                  </label>
                ))}
              </div>
            </div>
          </div>
  );
};

export default ActivityLevelStep;