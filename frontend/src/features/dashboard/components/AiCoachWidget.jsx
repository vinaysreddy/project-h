import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, MessageSquarePlus } from 'lucide-react';

const AiCoachWidget = ({ userData, healthMetrics, onExpandClick }) => {
  const firstName = userData?.displayName?.split(' ')[0] || 'there';
  const { bmiCategory } = healthMetrics;
  
  // Get a personalized tip based on user data
  const getTip = () => {
    switch(bmiCategory) {
      case 'Underweight':
        return "Try adding protein-rich snacks between meals to help gain healthy weight.";
      case 'Overweight':
      case 'Obese':
        return "Focus on portion control and increasing daily activity for sustainable weight loss.";
      case 'Healthy':
        return "Maintaining your weight is great! Consider adding strength training for overall fitness.";
      default:
        return "Remember to stay hydrated throughout the day for optimal energy levels.";
    }
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-gradient-to-br from-[#4D55CC] to-[#3E7B27] p-2 rounded-full text-white">
            <Bot size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <h3 className="text-md font-medium">Coach Tip</h3>
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">AI</span>
            </div>
            <p className="text-sm mb-3">{getTip()}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onExpandClick} 
              className="flex items-center text-blue-600 p-0 h-auto text-xs"
            >
              <MessageSquarePlus className="h-3 w-3 mr-1" />
              Ask coach more questions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiCoachWidget;