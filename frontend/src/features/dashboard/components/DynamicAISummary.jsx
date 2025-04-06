import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Sparkles, AlertCircle } from 'lucide-react';
import { getAISummary } from '../../coach/services/coachService';

const DynamicAISummary = ({ userData, healthMetrics, activeTab, onChatOpen }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get context-specific colors while keeping AI icon consistent
  const getContextVisuals = () => {
    switch(activeTab) {
      case 'nutrition':
        return {
          gradient: "from-[#3E7B27] to-[#70C04F]",
          bgGradient: "from-[#3E7B27]/5 to-[#70C04F]/5"
        };
      case 'fitness':
        return {
          gradient: "from-[#e72208] to-[#FF6B4A]",
          bgGradient: "from-[#e72208]/5 to-[#FF6B4A]/5"
        };
      case 'sleep':
        return {
          gradient: "from-[#4D55CC] to-[#8662E3]",
          bgGradient: "from-[#4D55CC]/5 to-[#8662E3]/5"
        };
      default:
        return {
          gradient: "from-[#4D55CC] to-[#3E7B27]",
          bgGradient: "from-[#4D55CC]/5 to-[#3E7B27]/5"
        };
    }
  };

  const { gradient, bgGradient } = getContextVisuals();
  
  useEffect(() => {
    const loadSummary = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Validate healthMetrics before calling API
        if (!healthMetrics || typeof healthMetrics !== 'object') {
          throw new Error('Invalid health metrics data');
        }
        
        // Get personalized AI summary based on current context
        const response = await getAISummary({
          userData,
          healthMetrics,
          context: activeTab,
        });
        
        if (!response || !response.summary) {
          throw new Error('Invalid response from AI service');
        }
        
        setSummary(response.summary);
      } catch (error) {
        console.error('Error fetching AI summary:', error);
        setError(error.message || 'Failed to load AI summary');
        setSummary(''); // Clear any previous summary
      } finally {
        setIsLoading(false);
      }
    };
    
    // Generate fallback content if we don't have any user data yet
    if (!userData || !healthMetrics) {
      setSummary('Welcome to your health dashboard. I can help you achieve your fitness goals.');
      setIsLoading(false);
      return;
    }
    
    // Debounce to prevent too many API calls when switching tabs
    const timer = setTimeout(() => {
      loadSummary();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [userData, healthMetrics, activeTab]);

  // Get fallback content if we have no data
  const getFallbackSummary = () => {
    const firstName = userData?.displayName?.split(' ')[0] || 'there';
    return `Hi ${firstName}! I'm your Oats coach. I'm here to help you reach your fitness and nutrition goals.`;
  };

  return (
    <Card className={`overflow-hidden border-none rounded-2xl shadow-md mb-6 bg-gradient-to-r ${bgGradient}`}>
      <CardContent className="p-5 md:p-6">
        <div className="flex items-center gap-4">
          {/* Consistent AI-themed icon with dynamic gradient */}
          <div className={`flex-shrink-0 bg-gradient-to-br ${gradient} p-3 rounded-xl text-white shadow-lg transform rotate-3`}>
            <Sparkles className="h-5 w-5" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center mb-1 gap-2">
              <h3 className="font-semibold text-lg text-gray-800">Oats</h3>
              <div className="bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center shadow-sm">
                <Sparkles className="inline h-3 w-3 mr-1 text-amber-500" />
                <span className="text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 inline-block text-transparent bg-clip-text">
                  Your Personalized AI Health &amp; Fitness Coach
                </span>
              </div>
            </div>
            
            <div className="mt-1.5">
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse w-4/5"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse w-2/3"></div>
                </div>
              ) : error ? (
                <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg text-sm">
                  <div className="flex items-center text-red-800 mb-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>Couldn't load your insights</span>
                  </div>
                  <p className="text-gray-700">{getFallbackSummary()}</p>
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed">{summary || getFallbackSummary()}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicAISummary;