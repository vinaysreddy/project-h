import React from 'react';

const FeatureCard = ({ title, description }) => {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h3 className="font-medium text-lg">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureCard;