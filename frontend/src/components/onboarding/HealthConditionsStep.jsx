import React from 'react';

const HealthConditionsStep = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Major Health Conditions (Optional)</label>
              <p className="text-sm text-gray-600 mb-3">Do you have any existing medical conditions or injuries? Select all that apply.</p>
              <div className="grid grid-cols-2 gap-y-2">
                {[
                  'No conditions',
                  'Diabetes',
                  'High Blood Pressure',
                  'Thyroid Issues',
                  'PCOS/PCOD',
                  'Heart Disease',
                  'Joint Pain/Arthritis',
                  'Asthma',
                  'Recent Injury'
                ].map(condition => (
                  <label key={condition} className="inline-flex items-center">
                    <input 
                      type="checkbox" 
                      name="healthConditions" 
                      value={condition} 
                      checked={formData.healthConditions.includes(condition)} 
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    {condition}
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Other Health Conditions</label>
                <textarea 
                  name="otherCondition" 
                  value={formData.otherCondition} 
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Please specify if any other condition"
                  rows="2"
                />
              </div>
            </div>
          </div>
  );
};

export default HealthConditionsStep;