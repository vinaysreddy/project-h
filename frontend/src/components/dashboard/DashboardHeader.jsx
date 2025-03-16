import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Bot, Sparkles, LayoutDashboard, ChevronRight, Apple, Dumbbell, Moon } from 'lucide-react';

const DashboardHeader = ({ userData, healthMetrics }) => {
  // Extract just what we need for the greeting
  const { bmiCategory } = healthMetrics;
  const firstName = userData?.name?.split(' ')[0] || 'there';
  
  // Get personalized message based on BMI category
  const personalizedMessage = getPersonalizedMessage(firstName, bmiCategory);
  
  // State for typing animation
  const [displayedGreeting, setDisplayedGreeting] = useState('');
  const [displayedInsight, setDisplayedInsight] = useState('');
  const [displayedRecommendation, setDisplayedRecommendation] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  // Typing effect for the greeting
  useEffect(() => {
    let greetingTimeout;
    let insightTimeout;
    let recommendationTimeout;
    
    // Type greeting
    if (displayedGreeting.length < personalizedMessage.greeting.length) {
      greetingTimeout = setTimeout(() => {
        setDisplayedGreeting(personalizedMessage.greeting.substring(0, displayedGreeting.length + 1));
      }, 30);
    } 
    // Start typing insight after greeting is complete
    else if (displayedInsight.length < personalizedMessage.insight.length) {
      insightTimeout = setTimeout(() => {
        setDisplayedInsight(personalizedMessage.insight.substring(0, displayedInsight.length + 1));
      }, 30);
    }
    // Start typing recommendation after insight is complete
    else if (displayedRecommendation.length < personalizedMessage.recommendation.length) {
      recommendationTimeout = setTimeout(() => {
        setDisplayedRecommendation(personalizedMessage.recommendation.substring(0, displayedRecommendation.length + 1));
      }, 30);
    } else {
      setIsTypingComplete(true);
    }
    
    return () => {
      clearTimeout(greetingTimeout);
      clearTimeout(insightTimeout);
      clearTimeout(recommendationTimeout);
    };
  }, [displayedGreeting, displayedInsight, displayedRecommendation, personalizedMessage]);
  
  return (
    <div className="space-y-6">
      {/* Dashboard Welcome Header */}
      <div className="flex justify-between items-center pb-2 border-b">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <LayoutDashboard className="mr-2 h-6 w-6 text-[#e72208]" /> 
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, <span className="font-medium">{firstName}</span>
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center">
            <span>Last updated: Today</span>
          </div>
        </div>
      </div>
      
      {/* AI Coach Card with Interactive Typing */}
      <Card className="p-6 border-none shadow-md bg-gradient-to-r from-gray-50 to-white overflow-hidden relative">
        {/* Subtle brand color accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#e72208] opacity-5 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#3E7B27] opacity-5 rounded-tr-full"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-[#4D55CC] opacity-5 rounded-full"></div>
        
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-[#4D55CC] to-[#3E7B27] p-3 rounded-full text-white shadow-md">
            <Bot size={24} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h2 className="text-lg font-semibold mr-2">RIA</h2>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full flex items-center">
                <Sparkles size={10} className="mr-1 text-[#e72208]" />
                Your Personal AI Coach
              </span>
            </div>
            
            <div className="prose prose-sm max-w-none min-h-[120px]">
              <p className="mb-2">{displayedGreeting}
                {displayedGreeting.length === personalizedMessage.greeting.length ? null : (
                  <span className="animate-pulse">|</span>
                )}
              </p>
              
              {displayedGreeting.length === personalizedMessage.greeting.length && (
                <p className="mb-2">{displayedInsight}
                  {displayedInsight.length === personalizedMessage.insight.length ? null : (
                    <span className="animate-pulse">|</span>
                  )}
                </p>
              )}
              
              {displayedInsight.length === personalizedMessage.insight.length && (
                <p>{displayedRecommendation}
                  {displayedRecommendation.length === personalizedMessage.recommendation.length ? null : (
                    <span className="animate-pulse">|</span>
                  )}
                </p>
              )}
            </div>
            
            {isTypingComplete && (
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="text-sm px-4 py-2 bg-[#3E7B27] text-white rounded-full hover:bg-opacity-90 transition-colors flex items-center">
                  <Apple className="mr-1.5 h-4 w-4" />
                  Create Diet Plan <ChevronRight className="ml-1 h-4 w-4" />
                </button>
                <button className="text-sm px-4 py-2 bg-[#e72208] text-white rounded-full hover:bg-opacity-90 transition-colors flex items-center">
                  <Dumbbell className="mr-1.5 h-4 w-4" />
                  Start Workout <ChevronRight className="ml-1 h-4 w-4" />
                </button>
                <button className="text-sm px-4 py-2 bg-[#4D55CC] text-white rounded-full hover:bg-opacity-90 transition-colors flex items-center">
                  <Moon className="mr-1.5 h-4 w-4" />
                  Sleep Tracker <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

// Helper function to generate personalized messages based on user's health status
function getPersonalizedMessage(name, bmiCategory) {
  // For MVP, these are static messages based only on BMI category
  // In a full version, these would incorporate more personalized data
  
  switch(bmiCategory) {
    case 'Underweight':
      return {
        greeting: `Hi ${name}, glad you're here! I've analyzed your stats and noticed you're currently underweight.`,
        insight: `This could impact your energy levels and overall health. Building lean muscle mass would be beneficial for you.`,
        recommendation: `Let's create a nutrition plan focused on healthy weight gain and a workout routine to build strength gradually.`
      };
    case 'Healthy':
      return {
        greeting: `Hi ${name}, great to see you! Based on your stats, you're at a healthy weight - that's excellent!`,
        insight: `Maintaining your current habits while optimizing for performance and longevity would be ideal for you.`,
        recommendation: `I can help you create a balanced fitness and nutrition plan to maintain your health and achieve your specific fitness goals.`
      };
    case 'Overweight':
      return {
        greeting: `Hi ${name}, I'm glad you're here! I've analyzed your stats and noticed you're carrying some extra weight.`,
        insight: `With some adjustments to your diet and activity levels, we can help you reach a healthier weight range.`,
        recommendation: `Let's create a sustainable diet and workout plan focused on gradual fat loss while preserving muscle mass.`
      };
    case 'Obese':
      return {
        greeting: `Hi ${name}, I'm really glad you're here! I've analyzed your stats and noticed you're currently in the obesity range.`,
        insight: `This puts you at higher risk for several health conditions, but the good news is we can make meaningful progress together.`,
        recommendation: `Let's create a gradual, sustainable plan to improve your health with realistic nutrition changes and appropriate exercise for your current fitness level.`
      };
    default:
      return {
        greeting: `Hi ${name}, welcome to your personal health dashboard!`,
        insight: `I'm RIA, your personal AI health coach. I'm here to help you achieve your fitness and wellness goals.`,
        recommendation: `Let's create customized diet and workout plans based on your specific needs and preferences.`
      };
  }
}

export default DashboardHeader;