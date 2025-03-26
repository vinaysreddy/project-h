import React from 'react';

const PersonalInfoStep = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Personal Information</h2>
        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#e72208] via-[#3E7B27] to-[#4D55CC] rounded-full"></div>
        <p className="text-gray-600 mt-4">Tell us a bit about yourself to help us personalize your experience</p>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-6">
          {/* Date of Birth Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <div className="relative">
              <input 
                type="date" 
                name="dateOfBirth" 
                value={formData.dateOfBirth} 
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4D55CC]/30 focus:border-[#4D55CC] transition-all outline-none"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-[#4D55CC]"></div>
              </div>
            </div>
            {formData.dateOfBirth && (
              <div className="text-sm text-gray-500 mt-2 flex items-center">
                <span className="inline-block h-2 w-2 rounded-full bg-[#4D55CC] mr-2"></span>
                {calculateAge(formData.dateOfBirth)} years old
              </div>
            )}
          </div>
          
          {/* Gender Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
            <div className="grid grid-cols-2 gap-4">
              <label 
                className={`flex items-center justify-center p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                  formData.gender === "Male" 
                    ? "border-[#e72208] bg-[#e72208]/5 text-[#e72208] font-medium" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    formData.gender === "Male" ? "border-[#e72208]" : "border-gray-400"
                  }`}>
                    {formData.gender === "Male" && (
                      <div className="w-2 h-2 rounded-full bg-[#e72208]"></div>
                    )}
                  </div>
                  <span>Male</span>
                </div>
                <input 
                  type="radio" 
                  name="gender" 
                  value="Male" 
                  checked={formData.gender === "Male"} 
                  onChange={handleInputChange}
                  className="sr-only"
                />
              </label>
              
              <label 
                className={`flex items-center justify-center p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                  formData.gender === "Female" 
                    ? "border-[#3E7B27] bg-[#3E7B27]/5 text-[#3E7B27] font-medium" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    formData.gender === "Female" ? "border-[#3E7B27]" : "border-gray-400"
                  }`}>
                    {formData.gender === "Female" && (
                      <div className="w-2 h-2 rounded-full bg-[#3E7B27]"></div>
                    )}
                  </div>
                  <span>Female</span>
                </div>
                <input 
                  type="radio" 
                  name="gender" 
                  value="Female" 
                  checked={formData.gender === "Female"} 
                  onChange={handleInputChange}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate age from DOB
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export default PersonalInfoStep;