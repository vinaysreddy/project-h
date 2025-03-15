import React from 'react';
import FeatureCard from './FeatureCard';

const HomeHero = ({ onGetStarted }) => {
  const features = [
    {
      title: "✅ Real-Time Adjustments",
      description: "Dynamic workout and nutrition plans that adapt to your body's feedback"
    },
    {
      title: "✅ AI-Driven Personalization",
      description: "Continuous learning from your data to create truly personalized recommendations"
    },
    {
      title: "✅ All-in-One Health Platform",
      description: "Fitness, nutrition, and sleep tracking in one seamless ecosystem"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">AI-Powered Health & Fitness</h1>
        <p className="text-xl mb-8">Personalized workout and nutrition plans based on your unique needs</p>
        
        <div className="mb-8 space-y-4">
          {features.map((feature, index) => (
            <FeatureCard key={index} title={feature.title} description={feature.description} />
          ))}
        </div>
        
        <button 
          onClick={onGetStarted}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HomeHero;