import React from 'react';
import { cmToInches, kgToLbs } from '@/utils/calculations';

const BodyMeasurementsStep = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Body Measurements</h2>
        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#e72208] via-[#3E7B27] to-[#4D55CC] rounded-full"></div>
        <p className="text-gray-600 mt-4">Let's customize your experience based on your current measurements</p>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-6">
          {/* Height Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input 
                  type="number" 
                  name="height" 
                  value={formData.height} 
                  onChange={handleInputChange}
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4D55CC]/30 focus:border-[#4D55CC] transition-all outline-none"
                  placeholder={formData.heightUnit === 'cm' ? 'Height in cm' : 'Height in inches'}
                />
              </div>
              <select 
                name="heightUnit" 
                value={formData.heightUnit} 
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#4D55CC]/30 focus:border-[#4D55CC] outline-none w-24"
              >
                <option value="cm">cm</option>
                <option value="in">in</option>
              </select>
            </div>
            {formData.height && formData.heightUnit === 'cm' && (
              <div className="text-sm text-gray-500 mt-2 flex items-center">
                <span className="inline-block h-2 w-2 rounded-full bg-[#4D55CC] mr-2"></span>
                {cmToInches(formData.height)} in imperial units
              </div>
            )}
            {formData.height && formData.heightUnit === 'in' && (
              <div className="text-sm text-gray-500 mt-2 flex items-center">
                <span className="inline-block h-2 w-2 rounded-full bg-[#4D55CC] mr-2"></span>
                {Math.round(formData.height * 2.54)} cm in metric units
              </div>
            )}
          </div>
          
          {/* Weight Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Weight</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input 
                  type="number" 
                  name="weight" 
                  value={formData.weight} 
                  onChange={handleInputChange}
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3E7B27]/30 focus:border-[#3E7B27] transition-all outline-none"
                  placeholder={formData.weightUnit === 'kg' ? 'Weight in kg' : 'Weight in lbs'}
                />
              </div>
              <select 
                name="weightUnit" 
                value={formData.weightUnit} 
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#3E7B27]/30 focus:border-[#3E7B27] outline-none w-24"
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
            {formData.weight && formData.weightUnit === 'kg' && (
              <div className="text-sm text-gray-500 mt-2 flex items-center">
                <span className="inline-block h-2 w-2 rounded-full bg-[#3E7B27] mr-2"></span>
                {kgToLbs(formData.weight)} lbs in imperial units
              </div>
            )}
            {formData.weight && formData.weightUnit === 'lbs' && (
              <div className="text-sm text-gray-500 mt-2 flex items-center">
                <span className="inline-block h-2 w-2 rounded-full bg-[#3E7B27] mr-2"></span>
                {Math.round(formData.weight / 2.205)} kg in metric units
              </div>
            )}
          </div>

          {/* Target Weight Field (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Weight <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input 
                  type="number" 
                  name="targetWeight" 
                  value={formData.targetWeight || ''} 
                  onChange={handleInputChange}
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e72208]/30 focus:border-[#e72208] transition-all outline-none"
                  placeholder={formData.weightUnit === 'kg' ? 'Target weight in kg' : 'Target weight in lbs'}
                />
              </div>
              <div className="w-24 p-3 text-center text-gray-500 bg-gray-50 border border-gray-300 rounded-lg">
                {formData.weightUnit}
              </div>
            </div>
            {formData.targetWeight && formData.weight && (
              <div className="text-sm text-gray-500 mt-2 flex items-center">
                <span className="inline-block h-2 w-2 rounded-full bg-[#e72208] mr-2"></span>
                {Math.abs(formData.targetWeight - formData.weight)} {formData.weightUnit} 
                {formData.targetWeight > formData.weight ? ' to gain' : ' to lose'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyMeasurementsStep;