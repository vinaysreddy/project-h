import React from 'react';

const PersonalInfoStep = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Date of Birth</label>
        <input 
          type="date" 
          name="dateOfBirth" 
          value={formData.dateOfBirth} 
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Gender</label>
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input 
              type="radio" 
              name="gender" 
              value="Male" 
              checked={formData.gender === "Male"} 
              onChange={handleInputChange}
              className="mr-2"
            />
            Male
          </label>
          <label className="inline-flex items-center">
            <input 
              type="radio" 
              name="gender" 
              value="Female" 
              checked={formData.gender === "Female"} 
              onChange={handleInputChange}
              className="mr-2"
            />
            Female
          </label>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;