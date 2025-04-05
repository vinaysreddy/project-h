import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send } from 'lucide-react';

const AiCoachCard = ({ userData, healthMetrics }) => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([
    {
      role: 'coach',
      content: `Hi ${userData?.displayName?.split(' ')[0] || 'there'}! I'm your AI health coach. How can I help you today?`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!query.trim()) return;
    
    // Add user message to conversation
    const userMessage = { role: 'user', content: query };
    setConversation(prev => [...prev, userMessage]);
    
    // Clear input
    setQuery('');
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to your backend
      // For this example, we'll simulate a response with a timeout
      setTimeout(() => {
        // Generate response based on query and health data
        let response;
        
        if (query.toLowerCase().includes('workout')) {
          response = `Based on your ${healthMetrics.bmiCategory || 'current'} BMI and ${userData.primaryGoal || 'health'} goals, I recommend starting with moderate intensity workouts 3-4 times per week. Focus on a mix of cardio and strength training.`;
        } else if (query.toLowerCase().includes('diet') || query.toLowerCase().includes('nutrition') || query.toLowerCase().includes('food')) {
          response = `Your daily calorie target is ${healthMetrics.calorieTarget || 2000} calories. Try to maintain a balanced diet with ${healthMetrics.macros?.protein || 25}% protein, ${healthMetrics.macros?.carbs || 45}% carbs, and ${healthMetrics.macros?.fat || 30}% healthy fats.`;
        } else if (query.toLowerCase().includes('weight') || query.toLowerCase().includes('bmi')) {
          response = `Your current BMI is ${healthMetrics.bmi?.toFixed(1) || 'not calculated'}, which is classified as ${healthMetrics.bmiCategory || 'unknown'}. ${userData.primaryGoal === 'weight_loss' ? 'For weight loss, aim for 0.5-1kg per week through diet and exercise.' : userData.primaryGoal === 'muscle_gain' ? 'For muscle gain, combine strength training with a slight calorie surplus.' : 'Maintaining a healthy weight requires balanced nutrition and regular exercise.'}`;
        } else {
          response = "I'm here to provide personalized health and fitness guidance based on your profile. You can ask me about workouts, nutrition, or general wellness tips!";
        }
        
        // Add coach response to conversation
        setConversation(prev => [...prev, { role: 'coach', content: response }]);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      setConversation(prev => [...prev, { 
        role: 'coach', 
        content: "I'm sorry, I'm having trouble responding right now. Please try again later." 
      }]);
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>AI Health Coach</CardTitle>
            <CardDescription>Your personalized health assistant</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 h-[400px] overflow-y-auto">
          {conversation.map((message, index) => (
            <div 
              key={index} 
              className={`mb-4 ${message.role === 'user' ? 'flex justify-end' : ''}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-tr-none' 
                    : 'bg-white border shadow-sm rounded-tl-none'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-3 rounded-lg bg-white border shadow-sm rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me about your health, diet, or workout plan..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} disabled={!query.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiCoachCard;