import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Sparkles, AlertCircle, Leaf, Zap, Sprout } from 'lucide-react';
import { getAISummary } from '../../coach/services/coachService';

const DynamicAISummary = ({ userData, healthMetrics, activeTab, onChatOpen }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get context-specific icon and colors
  const getContextVisuals = () => {
    switch(activeTab) {
      case 'nutrition':
        return {
          icon: <Leaf className="h-6 w-6" />,
          gradient: "from-[#3E7B27]/90 to-[#70C04F]/90",
          bgGradient: "from-[#3E7B27]/5 to-[#70C04F]/5"
        };
      case 'fitness':
        return {
          icon: <Zap className="h-6 w-6" />,
          gradient: "from-[#e72208]/90 to-[#FF6B4A]/90",
          bgGradient: "from-[#e72208]/5 to-[#FF6B4A]/5"
        };
      default:
        return {
          icon: <Sprout className="h-6 w-6" />,
          gradient: "from-[#4D55CC]/90 to-[#818CF8]/90",
          bgGradient: "from-[#4D55CC]/5 to-[#818CF8]/5"
        };
    }
  };

  const { icon, gradient, bgGradient } = getContextVisuals();
  
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
          {/* Unique visual oats-themed icon */}
          <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg text-white transform rotate-3`}>
            {icon}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center mb-1 gap-2">
              <h3 className="font-semibold text-lg text-gray-800">Oats</h3>
              <div className="bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center shadow-sm">
                <Sparkles className="inline h-3 w-3 mr-1 text-amber-500" />
                <span className="text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 inline-block text-transparent bg-clip-text">
                  AI Coach
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
              
              <Button
                variant="outline"
                size="sm"
                onClick={onChatOpen}
                className="mt-3.5 bg-white/70 backdrop-blur-sm hover:bg-white/90 border-none text-gray-700 hover:text-gray-900 shadow-sm"
              >
                <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                Talk with Oats
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicAISummary;