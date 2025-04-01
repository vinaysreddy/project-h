import React from 'react';

const ActivityLevelStep = ({ formData, handleInputChange }) => {
  // Enhanced activity levels with icons, descriptions, and brand colors
  const activityLevels = [
    {
      id: 'sedentary',
      level: '1',
      title: 'Sedentary',
      description: 'Little to no exercise, mostly sitting all day',
      icon: '🪑',
      color: '#e72208' // red - using your brand color
    },
    {
      id: 'lightly_active',
      level: '2',
      title: 'Lightly Active',
      description: 'Light exercise 1-3 days per week',
      icon: '🚶',
      color: '#e86e4d' // lighter red
    },
    {
      id: 'moderately_active',
      level: '3',
      title: 'Moderately Active',
      description: 'Moderate exercise 3-5 days per week',
      icon: '🚴',
      color: '#3E7B27' // green - using your brand color
    },
    {
      id: 'active',
      level: '4',
      title: 'Active',
      description: 'Intense exercise 6-7 days per week or physically active job',
      icon: '🏃',
      color: '#2f669a' // medium blue
    },
    {
      id: 'very_active',
      level: '5',
      title: 'Very Active',
      description: 'Highly strenuous exercise and physically demanding jobs',
      icon: '🏋️',
      color: '#4D55CC' // blue - using your brand color
    }
  ];

  return (
    <div className="space-y-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <p className="text-gray-600 mt-4">Tell us about your typical daily activity to help tailor your plan</p>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Daily Activity Level</label>
            <div className="space-y-3">
              {activityLevels.map((activity) => {
                const isSelected = formData.activityLevel === activity.id;
                
                return (
                  <label 
                    key={activity.id}
                    className={`
                      block p-4 border rounded-lg cursor-pointer transition-all duration-200
                      ${isSelected 
                        ? `border-[${activity.color}] bg-[${activity.color}]/5 shadow-sm` 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <input 
                      type="radio" 
                      name="activityLevel" 
                      value={activity.id} 
                      checked={isSelected} 
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    
                    <div className="flex items-center">
                      <div className={`
                        flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full mr-4
                        ${isSelected ? `bg-[${activity.color}]/10` : 'bg-gray-100'}
                      `}>
                        <span className="text-xl">{activity.icon}</span>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <span className={`
                            inline-flex items-center justify-center w-5 h-5 rounded-full 
                            text-white text-xs font-medium mr-2
                            ${isSelected ? `bg-[${activity.color}]` : 'bg-gray-300'}
                          `}>
                            {activity.level}
                          </span>
                          <span className={`
                            font-medium 
                            ${isSelected ? `text-[${activity.color}]` : 'text-gray-800'}
                          `}>
                            {activity.title}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                      </div>
                      
                      {isSelected && (
                        <div className="ml-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={activity.color}>
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              <span className="font-medium">Pro Tip:</span> Your daily activity level helps us determine your basal metabolic rate and calorie needs for optimal results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLevelStep;