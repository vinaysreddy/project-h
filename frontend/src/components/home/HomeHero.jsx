import React, { useEffect, useState } from 'react';

const HomeHero = ({onGetStarted}) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Core benefits - simple and accessible
  const coreBenefits = [
    {
      icon: "🏋️",
      color: "#e72208", // fitness color
      title: "Simple Fitness",
      description: "Workouts that adapt to your abilities, no matter your experience level"
    },
    {
      icon: "🥗",
      color: "#3E7B27", // diet color
      title: "Easy Nutrition",
      description: "Practical meal suggestions that fit your lifestyle and preferences"
    },
    {
      icon: "😴",
      color: "#4D55CC", // sleep color
      title: "Better Sleep",
      description: "Simple tips to improve your rest based on your personal patterns"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Background with darker color pattern */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-white via-white to-gray-100">
          {/* Fitness red shape - darker but still subtle */}
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#e72208] opacity-10 rounded-bl-full"></div>
          {/* Diet green shape - darker but still subtle */}
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#3E7B27] opacity-10 rounded-tr-full"></div>
          {/* Sleep blue shape - darker but still subtle */}
          <div className="absolute top-1/3 left-1/4 w-1/4 h-1/4 bg-[#4D55CC] opacity-10 rounded-full"></div>
          
          {/* Additional subtle shapes for more depth */}
          <div className="absolute bottom-1/4 right-1/5 w-1/5 h-1/5 bg-[#e72208] opacity-8 rounded-tl-full"></div>
          <div className="absolute top-2/3 left-1/3 w-1/6 h-1/6 bg-[#3E7B27] opacity-8 rounded-full"></div>
        </div>
      </div>

      {/* Content over the background */}
      <div className="relative z-10">
        {/* Navigation Bar - Simplified */}
        <nav className="flex justify-between items-center py-4 px-6 md:px-16 bg-white bg-opacity-90 shadow-sm">
          <div className="font-bold text-2xl">FitSync</div>
          <div className="flex gap-4">
            <button className="px-5 py-2 rounded-full text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors">
              Sign In
            </button>
            <button 
              onClick={onGetStarted}
              className="px-5 py-2 rounded-full bg-[#e72208] text-white hover:bg-opacity-90 transition-colors"
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Section - Simplified messaging with color accents */}
        <section className="pt-16 pb-24 px-4 md:px-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <h1 className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-1000 ease-out ${
                animate ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-16'
              }`}>
                <span className="block">Fitness for Everyone</span>
                <span className="block h-1 w-24 mx-auto mt-6 bg-gradient-to-r from-[#e72208] via-[#3E7B27] to-[#4D55CC] rounded-full"></span>
              </h1>
              
              <p className={`text-gray-600 text-lg mb-10 mx-auto max-w-2xl transition-all duration-1000 delay-300 ${
                animate ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
              }`}>
                Your personal health companion that makes fitness, nutrition, and sleep 
                simple, effective, and tailored just for you.
              </p>
              
              <div className={`flex flex-col sm:flex-row justify-center gap-4 transition-all duration-1000 delay-500 ${
                animate ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
              }`}>
                <button 
                  onClick={onGetStarted}
                  className="bg-[#e72208] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-opacity-90 transition-colors shadow-md"
                >
                  Get Started
                </button>
                <button className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-50 transition-colors shadow-sm">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Core Benefits - Color coded cards */}
        <section className="py-16 px-4 md:px-16 bg-white bg-opacity-95">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How We Help You</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coreBenefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow text-center border-t-4" style={{borderColor: benefit.color}}>
                  <div className="text-5xl mb-6 mx-auto">{benefit.icon}</div>
                  <h3 className="text-xl font-bold mb-3" style={{color: benefit.color}}>{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Simplified steps with connected design */}
        <section className="py-16 px-4 md:px-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Three Simple Steps</h2>
            
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-[#e72208] via-[#3E7B27] to-[#4D55CC]"></div>
              
              <div className="flex flex-col items-center relative">
                <div className="w-16 h-16 rounded-full bg-[#e72208] text-white flex items-center justify-center text-xl font-bold mb-4 shadow-md z-10">1</div>
                <h3 className="text-lg font-bold mb-2">Sign Up</h3>
                <p className="text-gray-600">Create your account and tell us about yourself</p>
              </div>
              
              <div className="flex flex-col items-center relative">
                <div className="w-16 h-16 rounded-full bg-[#3E7B27] text-white flex items-center justify-center text-xl font-bold mb-4 shadow-md z-10">2</div>
                <h3 className="text-lg font-bold mb-2">Connect</h3>
                <p className="text-gray-600">Link your devices for personalized insights</p>
              </div>
              
              <div className="flex flex-col items-center relative">
                <div className="w-16 h-16 rounded-full bg-[#4D55CC] text-white flex items-center justify-center text-xl font-bold mb-4 shadow-md z-10">3</div>
                <h3 className="text-lg font-bold mb-2">Improve</h3>
                <p className="text-gray-600">Follow your simple, personalized health plan</p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <button 
                onClick={onGetStarted}
                className="bg-[#e72208] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-opacity-90 transition-colors shadow-md"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </section>

        {/* Testimonial Section - with color accent */}
        <section className="py-16 px-4 md:px-16 bg-white bg-opacity-95">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-10">Real Results, Real People</h2>
            
            <div className="bg-white p-8 rounded-xl shadow-md relative">
              {/* Color accents */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e72208] via-[#3E7B27] to-[#4D55CC]"></div>
              
              <div className="mb-6">
                <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto border-4 border-white shadow-md"></div>
              </div>
              <p className="text-lg mb-6 italic">
                "I never thought fitness could be this accessible. FitSync makes it easy to understand my body 
                and what it needs. No complicated routines - just simple, effective guidance."
              </p>
              <p className="font-bold">Sarah T.</p>
              <p className="text-sm text-gray-600">Using FitSync for 6 months</p>
            </div>
          </div>
        </section>

        {/* CTA Section - with layered background */}
        <section className="py-16 px-4 md:px-16 relative overflow-hidden">
          {/* Layered background with all three colors */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#e72208] to-[#3E7B27]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[#4D55CC] opacity-15 transform -skew-y-6"></div>
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Start Your Health Journey Today</h2>
            <p className="text-white text-lg mb-8 opacity-90">
              Join thousands who've made health simple with FitSync
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="bg-white text-[#e72208] px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors shadow-md"
                >
                Get Started
              </button>
              <button className="bg-transparent text-white border border-white px-8 py-3 rounded-full text-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </section>

        {/* Footer - Simplified with color accent */}
        <footer className="py-10 bg-gray-900 text-gray-400 px-4 md:px-16 relative overflow-hidden">
          {/* Subtle color accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e72208] via-[#3E7B27] to-[#4D55CC]"></div>
          
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="mb-6 md:mb-0">
                <div className="font-bold text-xl text-white mb-2">FitSync</div>
                <p className="text-sm">Fitness for everyone</p>
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

export default HomeHero;