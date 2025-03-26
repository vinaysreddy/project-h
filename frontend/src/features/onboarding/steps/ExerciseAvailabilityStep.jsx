import React from 'react';

const ExerciseAvailabilityStep = ({ formData, handleInputChange }) => {
  // Enhanced availability options with structured data
  const availabilityOptions = [
    {
      id: '1-2 days/week',
      title: '1-2 days/week',
      description: 'Low frequency',
      icon: '📅',
      color: '#e72208', // red from brand colors
      level: 1
    },
    {
      id: '3-4 days/week',
      title: '3-4 days/week',
      description: 'Moderate frequency',
      icon: '📆',
      color: '#3E7B27', // green from brand colors
      level: 2
    },
    {
      id: '5-6 days/week',
      title: '5-6 days/week',
      description: 'High frequency',
      icon: '🗓️',
      color: '#4D55CC', // blue from brand colors
      level: 3
    },
    {
      id: '5+ days/week',
      title: '5+ days/week',
      description: 'Very high frequency',
      icon: '⭐',
      color: '#8e44ad', // purple
      level: 4
    }
  ];

  return (
    <div className="space-y-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Weekly Exercise Availability</h2>
        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#e72208] via-[#3E7B27] to-[#4D55CC] rounded-full"></div>
        <p className="text-gray-600 mt-4">How many days per week can you realistically commit to working out?</p>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availabilityOptions.map(option => {
            const isSelected = formData.weeklyExercise === option.id;
            
            return (
              <label 
                key={option.id}
                className={`
                  flex flex-col p-5 border rounded-lg cursor-pointer transition-all duration-300
                  ${isSelected 
                    ? `border-[${option.color}] bg-[${option.color}]/5 shadow-sm` 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <input 
                  type="radio" 
                  name="weeklyExercise" 
                  value={option.id} 
                  checked={isSelected} 
                  onChange={handleInputChange}
                  className="sr-only"
                />
                
                <div className="flex items-center mb-2">
                  <div className={`
                    w-10 h-10 flex items-center justify-center rounded-full mr-3
                    ${isSelected ? `bg-[${option.color}]/10 text-[${option.color}]` : 'bg-gray-100 text-gray-600'}
                  `}>
                    <span className="text-xl">{option.icon}</span>
                  </div>
                  
                  <div className="flex-grow">
                    <div className={`font-medium ${isSelected ? `text-[${option.color}]` : 'text-gray-800'}`}>
                      {option.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {option.description}
                    </div>
                  </div>
                  
                  {isSelected && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={option.color}>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">Recommended for:</div>
                    <div className={`text-xs font-medium ${isSelected ? `text-[${option.color}]` : 'text-gray-600'}`}>
                      {option.level === 1 && 'Beginners'}
                      {option.level === 2 && 'Intermediate'}
                      {option.level === 3 && 'Advanced'}
                      {option.level === 4 && 'Athletes'}
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3E7B27] mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p>Choose a schedule you can realistically maintain. Consistency is more important than frequency.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseAvailabilityStep;