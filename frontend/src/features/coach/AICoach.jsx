import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { sendChatMessage, getChatHistory } from './services/coachService';
// Import health calculation functions from your utility file
import * as calculations from '@/utils/healthMetricsCalculator';

const AICoach = ({ userData, healthMetrics }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const { getToken } = useAuth();
  
  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const history = await getChatHistory(token);
      
      if (history?.messages?.length > 0) {
        setMessages(history.messages);
      } else {
        // Add welcome message if no history
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: `Hi there! I'm your AI health coach. Based on your profile, I can help with personalized advice for your ${userData.primaryGoal || 'fitness'} goals. How can I assist you today?`,
          timestamp: new Date()
        }]);
      }
    } catch (err) {
      setError('Failed to load chat history');
      console.error('Error loading chat history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    // Clear any previous errors
    setError(null);
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const token = await getToken();
      
      // Create a clean copy of user data with all available metrics
      const enhancedUserData = {
        ...userData,
        // Make sure these fields exist as they are critical for personalization
        bmi: userData?.bmi || userData?.healthMetrics?.bmi || 
          calculations.calculateBMI(userData?.height, userData?.weight, 'cm', 'kg'),
        bmiCategory: userData?.bmiCategory || 
          (userData?.bmi ? calculations.getBMICategory(userData?.bmi).category : 
          calculations.getBMICategory(calculations.calculateBMI(userData?.height, userData?.weight, 'cm', 'kg')).category),
        healthMetrics: {
          ...healthMetrics,
          bmi: healthMetrics?.bmi || userData?.bmi || 
            calculations.calculateBMI(userData?.height, userData?.weight, 'cm', 'kg'),
          bmiCategory: healthMetrics?.bmiCategory ||
            (userData?.bmi ? calculations.getBMICategory(userData?.bmi).category : 
            calculations.getBMICategory(calculations.calculateBMI(userData?.height, userData?.weight, 'cm', 'kg')).category)
        }
      };
      
      console.log("Sending enhanced user data:", enhancedUserData);
      
      const response = await sendChatMessage({
        message: inputMessage,
        userData: enhancedUserData,
        healthMetrics: enhancedUserData.healthMetrics || {}
      }, token);
      
      if (response?.message) {
        setMessages(prev => [...prev, {
          id: response.id || Date.now().toString() + '-response',
          role: 'assistant',
          content: response.message,
          timestamp: new Date()
        }]);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Add error message to chat
      setMessages(prev => [...prev, {
        id: 'error-' + Date.now(),
        role: 'system',
        content: `Sorry, I encountered an error. Please try again. ${
          process.env.NODE_ENV !== 'production' ? `(${err.message})` : ''
        }`,
        timestamp: new Date(),
        error: true
      }]);
      
      setError('Failed to get response from coach. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Display messages with appropriate styling
  const displayMessages = showFullHistory 
    ? messages 
    : messages.slice(-4); // Show only recent messages if not expanded

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Bot className="h-5 w-5 mr-2 text-[#4D55CC]" />
          AI Health Coach
        </CardTitle>
        <CardDescription>
          Get personalized health and fitness advice
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col h-full p-4">
        {/* Chat messages container */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.length > 4 && !showFullHistory && (
            <div className="text-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFullHistory(true)}
                className="text-xs text-gray-500"
              >
                <ChevronUp className="h-3 w-3 mr-1" />
                Show previous messages
              </Button>
            </div>
          )}
          
          {showFullHistory && messages.length > 4 && (
            <div className="text-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFullHistory(false)}
                className="text-xs text-gray-500"
              >
                <ChevronDown className="h-3 w-3 mr-1" />
                Show recent messages
              </Button>
            </div>
          )}
          
          {displayMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user' 
                    ? 'bg-gray-200 text-gray-800 rounded-tr-none' 
                    : msg.error 
                      ? 'bg-red-50 text-red-600 border border-red-200 rounded-tl-none'
                      : 'bg-[#4D55CC]/10 text-gray-700 rounded-tl-none'
                }`}
              >
                <div className="flex items-center mb-1">
                  {msg.role === 'user' ? (
                    <User className="h-3 w-3 mr-1 text-gray-600" />
                  ) : (
                    <Bot className="h-3 w-3 mr-1 text-[#4D55CC]" />
                  )}
                  <span className="text-xs text-gray-500">
                    {msg.role === 'user' ? 'You' : 'Coach'} • {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#4D55CC]/10 text-gray-700 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                <div className="flex items-center mb-1">
                  <Bot className="h-3 w-3 mr-1 text-[#4D55CC]" />
                  <span className="text-xs text-gray-500">Coach</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="flex items-center border-t pt-3">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask your health coach anything..."
            className="flex-1 mr-2"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputMessage.trim() || isLoading}
            className="bg-[#4D55CC] hover:bg-[#394099]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {error && (
          <p className="text-red-500 text-xs mt-2">
            {error} <Button variant="link" className="p-0 h-auto text-xs" onClick={loadChatHistory}><RefreshCw className="h-3 w-3 mr-1" /> Retry</Button>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AICoach;