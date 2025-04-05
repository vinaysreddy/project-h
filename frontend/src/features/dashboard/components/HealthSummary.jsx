import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, TrendingUp, User, Scale, CalendarClock } from 'lucide-react';

const HealthSummary = ({ userData, healthMetrics }) => {
  // Add safe type checking for bmi - ensure it's a number
  const bmi = typeof healthMetrics.bmi === 'number' ? healthMetrics.bmi : 0;
  const { bmiCategory, bmiColor, calorieTarget, tdee } = healthMetrics;
  const firstName = userData?.displayName?.split(' ')[0] || 'there';
  
  // Calculate progress towards goal (simplified example)
  const goalProgress = 65; // In a real app, calculate based on starting point and current metrics
  
  // Debug log to diagnose the issue
  console.log('HealthMetrics in HealthSummary:', healthMetrics);
  console.log('BMI type:', typeof bmi, 'Value:', bmi);
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Hi, {firstName}</h3>
            <p className="text-sm text-gray-500">Here's your health snapshot</p>
          </div>
          <div className="bg-blue-50 p-2 rounded-full">
            <PieChart className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <Scale className="h-3 w-3 mr-1 text-gray-500" />
              <p className="text-xs text-gray-500">BMI</p>
            </div>
            {/* Fixed toFixed usage */}
            <p className="text-lg font-medium">{typeof bmi === 'number' ? bmi.toFixed(1) : '--'}</p>
            <p className={`text-xs ${bmiColor || 'text-gray-500'}`}>{bmiCategory || 'Not calculated'}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <CalendarClock className="h-3 w-3 mr-1 text-gray-500" />
              <p className="text-xs text-gray-500">Daily Target</p>
            </div>
            <p className="text-lg font-medium">{calorieTarget || '--'}</p>
            <p className="text-xs text-gray-500">calories</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <User className="h-3 w-3 mr-1 text-gray-500" />
              <p className="text-xs text-gray-500">Weight</p>
            </div>
            <p className="text-lg font-medium">{userData?.weight || '--'}</p>
            <p className="text-xs text-gray-500">{userData?.weightUnit || 'kg'}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <TrendingUp className="h-3 w-3 mr-1 text-gray-500" />
              <p className="text-xs text-gray-500">Goal Progress</p>
            </div>
            <Progress value={goalProgress} className="h-2 mt-2" />
            <p className="text-xs text-right mt-1">{goalProgress}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthSummary;