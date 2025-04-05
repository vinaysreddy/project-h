import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Scale, Flame, Heart, Activity, PlusCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HealthSummary = ({ userData, healthMetrics, className = "" }) => {
  // Add safe type checking for bmi - ensure it's a number
  const bmi = typeof healthMetrics.bmi === 'number' ? healthMetrics.bmi : 0;
  const { bmiCategory, bmiColor, calorieTarget, tdee, bmr } = healthMetrics;
  
  return (
    <Card className={`border-gray-100 shadow-sm overflow-hidden ${className}`}>
      {/* Decorative top border using theme colors */}
      <div className="h-0.5 bg-gradient-to-r from-[#4D55CC] via-[#3E7B27] to-[#e72208]"></div>
      
      <CardContent className="p-4">
        <div className="flex items-center gap-2 md:gap-6 flex-wrap justify-between">
          {/* BMI */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-[#4D55CC]/10">
              <Scale className="h-3.5 w-3.5 text-[#4D55CC]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 leading-none">BMI</p>
              <div className="flex items-baseline gap-1">
                <p className="font-medium">{typeof bmi === 'number' ? bmi.toFixed(1) : '--'}</p>
                <span className={`text-[10px] ${bmiColor || 'text-gray-500'}`}>{bmiCategory || 'Unknown'}</span>
              </div>
            </div>
          </div>
          
          {/* Daily Target */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-[#3E7B27]/10">
              <Flame className="h-3.5 w-3.5 text-[#3E7B27]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 leading-none">Daily Target</p>
              <div className="flex items-baseline gap-1">
                <p className="font-medium">{calorieTarget || '--'}</p>
                <span className="text-[10px] text-gray-500">cal</span>
              </div>
            </div>
          </div>
          
          {/* Weight */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-[#e72208]/10">
              <Activity className="h-3.5 w-3.5 text-[#e72208]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 leading-none">Weight</p>
              <div className="flex items-baseline gap-1">
                <p className="font-medium">{userData?.weight || '--'}</p>
                <span className="text-[10px] text-gray-500">{userData?.weightUnit || 'kg'}</span>
              </div>
            </div>
          </div>
          
          {/* BMR */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-blue-50">
              <Heart className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 leading-none">BMR</p>
              <div className="flex items-baseline gap-1">
                <p className="font-medium">{bmr?.toFixed(0) || '--'}</p>
                <span className="text-[10px] text-gray-500">cal</span>
              </div>
            </div>
          </div>
          
          {/* View Details Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-[#4D55CC] hover:bg-[#4D55CC]/5 py-1"
          >
            <span>View Details</span>
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthSummary;