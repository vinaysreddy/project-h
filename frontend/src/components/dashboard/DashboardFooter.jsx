import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Star, 
  Zap, 
  CheckCircle, 
  Lock, 
  ArrowRight, 
  X, 
  Heart,
  Twitter,
  Instagram,
  Facebook
} from 'lucide-react';

const DashboardFooter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to join waitlist
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail('');
    }, 1500);
  };

  return (
    <footer className="mt-12 pt-6">
      {/* Early Access Banner */}
      {showBanner && (
        <Card className="bg-gradient-to-r from-[#4D55CC] to-[#3b41a5] text-white mb-8 overflow-hidden relative">
          <button 
            onClick={() => setShowBanner(false)} 
            className="absolute top-3 right-3 text-white/80 hover:text-white"
            aria-label="Close banner"
          >
            <X size={20} />
          </button>
          
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-300" />
                <h3 className="font-bold text-lg">Early Access Program</h3>
              </div>
              <p className="text-white/90 max-w-md">
                Get exclusive features and priority support by joining our waitlist today. We're rolling out enhanced AI-powered health plans soon!
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-300" />
                  <span>Premium Features</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-300" />
                  <span>Early Access</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-300" />
                  <span>Priority Support</span>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-auto">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex w-full md:w-auto">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-11 min-w-[220px] bg-white border-0 text-gray-900"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="ml-2 bg-[#e72208] hover:bg-[#d41700] h-11 px-4 font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full"></span>
                        Joining...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Join Waitlist
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="bg-white text-[#4D55CC] p-3 rounded-md flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span className="font-medium">You're on the waitlist!</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
      
      {/* Main Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-[#e72208]" /> About Project H
          </h3>
          <p className="text-gray-600 mb-4">
            Project H is an AI-powered health platform designed to provide personalized fitness and nutrition plans based on your unique profile, goals, and preferences.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-[#1DA1F2]" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#E1306C]" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#1877F2]" aria-label="Facebook">
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="font-bold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-[#4D55CC]">Home</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#4D55CC]">About Us</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#4D55CC]">Features</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#4D55CC]">Success Stories</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#4D55CC]">Help Center</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold text-lg mb-4">Coming Soon</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <Zap className="h-5 w-5 mr-2 text-[#e72208] flex-shrink-0" />
              <span className="text-gray-600">Advanced workout video library</span>
            </li>
            <li className="flex items-start">
              <Zap className="h-5 w-5 mr-2 text-[#3E7B27] flex-shrink-0" />
              <span className="text-gray-600">Custom meal planning with grocery lists</span>
            </li>
            <li className="flex items-start">
              <Zap className="h-5 w-5 mr-2 text-[#4D55CC] flex-shrink-0" />
              <span className="text-gray-600">Integration with fitness wearables</span>
            </li>
            <li className="flex items-start">
              <Zap className="h-5 w-5 mr-2 text-purple-500 flex-shrink-0" />
              <span className="text-gray-600">Community challenges and support groups</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="pt-6 border-t text-center">
        <div className="flex flex-wrap justify-center space-x-6 text-sm text-gray-500 mb-4">
          <a href="#" className="hover:text-[#4D55CC] hover:underline">Privacy Policy</a>
          <a href="#" className="hover:text-[#4D55CC] hover:underline">Terms of Service</a>
          <a href="#" className="hover:text-[#4D55CC] hover:underline">Cookie Policy</a>
          <a href="#" className="hover:text-[#4D55CC] hover:underline">Contact Us</a>
        </div>
        <div className="flex items-center justify-center text-sm text-gray-400 mb-2">
          <Lock className="h-4 w-4 mr-1" />
          <span>Your data is secure and encrypted</span>
        </div>
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Project H. All rights reserved. Remember to consult with healthcare professionals before starting any new fitness or diet program.
        </p>
      </div>
    </footer>
  );
};

export default DashboardFooter;