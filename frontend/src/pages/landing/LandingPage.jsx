import React, { useEffect, useState } from 'react';

const LandingPage = ({ onGetStarted, onLogin }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts - keeping this simple
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Core benefits with improved descriptions
  const coreBenefits = [
    {
      icon: "🏋️",
      color: "#e72208", // fitness color
      title: "Smart Fitness",
      description: "Personalized workouts that evolve with your progress and energy levels"
    },
    {
      icon: "🥗",
      color: "#3E7B27", // diet color
      title: "Intuitive Nutrition",
      description: "Balanced meal plans that adapt to your preferences and lifestyle"
    },
    {
      icon: "😴",
      color: "#4D55CC", // sleep color
      title: "Restorative Sleep",
      description: "Tailored sleep insights that improve your recovery and energy"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section with improved visual hierarchy */}
      <div className="relative">
        {/* Navigation Bar - Added onLogin to Sign In button */}
        <nav className="flex justify-between items-center py-5 px-6 md:px-16 bg-white shadow-sm sticky top-0 z-50">
          <div className="font-bold text-2xl relative group flex items-center">
            <span className="text-[#e72208]">Fit</span>
            <span className="text-[#3E7B27]">Sync</span>
            <div className="h-1.5 w-1.5 rounded-full bg-[#4D55CC] ml-0.5 mb-4"></div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onLogin}
              className="px-5 py-2 rounded-full text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={onGetStarted}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#e72208] to-[#e72208]/90 text-white hover:shadow-md transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Banner - no changes */}
        <section className="relative pt-16 pb-20 px-4 md:px-16 overflow-hidden">
          {/* Abstract shapes in background - subtle and non-distracting */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#e72208]/5 rounded-full"></div>
          <div className="absolute bottom-40 -left-20 w-72 h-72 bg-[#3E7B27]/5 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-[#4D55CC]/5 rounded-full"></div>
          
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center">
              <div className={`inline-block mb-6 transition-all duration-700 ${
                animate ? 'opacity-100' : 'opacity-0'
              }`}>
                <span className="px-4 py-1 bg-gray-100 rounded-full text-gray-600 font-medium text-sm">
                  Health and Fitness for Everyone
                </span>
              </div>
              
              <h1 className={`text-4xl md:text-6xl font-bold mb-6 tracking-tight transition-all duration-700 ${
                animate ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
              }`}>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#e72208] via-[#3E7B27] to-[#4D55CC]">
                  Your Complete Health Journey
                </span>
                <span className="block text-gray-800 mt-2">Starts Here</span>
              </h1>
              
              <p className={`text-gray-600 text-lg mb-10 mx-auto max-w-2xl transition-all duration-700 delay-100 ${
                animate ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
              }`}>
                One app that seamlessly integrates your fitness, nutrition, and sleep data
                to create a truly personalized health experience.
              </p>
              
              <div className={`flex flex-col sm:flex-row justify-center gap-4 transition-all duration-700 delay-200 ${
                animate ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
              }`}>
                <button 
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-[#e72208] to-[#e72208]/90 text-white px-8 py-3 rounded-full text-lg font-medium hover:shadow-lg transition-all duration-300"
                >
                  Start Your Journey
                </button>
                {/* Added Sign In option here as well for better visibility */}
                <button 
                  onClick={onLogin}
                  className="bg-white text-gray-700 border border-gray-200 px-8 py-3 rounded-full text-lg font-medium hover:border-gray-300 transition-all duration-300"
                >
                  Sign In
                </button>
              </div>
              
              {/* Device integrations badge */}
              <div className={`mt-12 transition-all duration-700 delay-300 ${
                animate ? 'opacity-70' : 'opacity-0'
              }`}>
                <p className="text-sm text-gray-500 mb-3">Integrates seamlessly with</p>
                <div className="flex justify-center items-center gap-6">
                  <span className="text-gray-400 font-medium">Apple Watch</span>
                  <span className="text-gray-400 font-medium">Garmin</span>
                  <span className="text-gray-400 font-medium">Whoop</span>
                  <span className="text-gray-400 font-medium">Oura</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of the component remains unchanged */}
        <section className="py-16 px-4 md:px-16 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Your Health, Simplified</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coreBenefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 text-center border border-gray-100 group" 
                >
                  <div className="p-3 rounded-full inline-flex mb-6 bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300">
                    <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{color: benefit.color}}>{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 md:px-16 relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e72208] via-[#3E7B27] to-[#4D55CC]"></div>
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Transform Your Health Journey Today</h2>
            <p className="text-gray-300 text-lg mb-8">
              Join thousands who've made health management effortless with FitSync
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-3 rounded-full text-lg font-medium transition-colors shadow-md"
              >
                Get Started
              </button>
              {/* Changed "View Demo" to "Sign In" for another login option */}
              <button 
                onClick={onLogin}
                className="bg-transparent text-white border border-gray-600 hover:border-gray-400 px-8 py-3 rounded-full text-lg font-medium transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </section>

        <footer className="py-10 bg-gray-900 text-gray-400 px-4 md:px-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="mb-6 md:mb-0">
                <div className="font-bold text-xl text-white mb-2 flex items-center">
                  <span className="text-[#e72208]">Fit</span>
                  <span className="text-[#3E7B27]">Sync</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-[#4D55CC] ml-0.5 mb-4"></div>
                </div>
                <p className="text-sm">Health and Fitness for Everyone</p>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                <a href="#" className="hover:text-white transition-colors">About</a>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
                <a href="#" className="hover:text-white transition-colors">Help</a>
              </div>
            </div>
            <div className="text-center text-sm border-t border-gray-800 pt-6">
              © 2025 FitSync. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;