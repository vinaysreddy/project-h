import React from 'react';
import { cmToInches, kgToLbs } from '@/utils/calculations';

const BodyMeasurementsStep = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Height</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  name="height" 
                  value={formData.height} 
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder={formData.heightUnit === 'cm' ? 'Height in cm' : 'Height in inches'}
                />
                <select 
                  name="heightUnit" 
                  value={formData.heightUnit} 
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                </select>
              </div>
              {formData.height && formData.heightUnit === 'cm' && (
                <div className="text-sm text-gray-500 mt-1">
                  {cmToInches(formData.height)} in imperial units
                </div>
              )}
              {formData.height && formData.heightUnit === 'in' && (
                <div className="text-sm text-gray-500 mt-1">
                  {Math.round(formData.height * 2.54)} cm in metric units
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Current Weight</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  name="weight" 
                  value={formData.weight} 
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder={formData.weightUnit === 'kg' ? 'Weight in kg' : 'Weight in lbs'}
                />
                <select 
                  name="weightUnit" 
                  value={formData.weightUnit} 
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
              {formData.weight && formData.weightUnit === 'kg' && (
                <div className="text-sm text-gray-500 mt-1">
                  {kgToLbs(formData.weight)} lbs in imperial units
                </div>
              )}
              {formData.weight && formData.weightUnit === 'lbs' && (
                <div className="text-sm text-gray-500 mt-1">
                  {Math.round(formData.weight / 2.205)} kg in metric units
                </div>
              )}
            </div>
          </div>
  );
};

export default BodyMeasurementsStep;