import React from 'react';
import { Shield, Heart, MessageCircle, Users2 } from 'lucide-react';

export default function Guidelines() {
  const guidelines = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Be Respectful",
      description: "Treat everyone with respect and kindness. Remember that behind every profile is a fellow student."
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Stay Positive",
      description: "Maintain a positive and constructive attitude in all your interactions."
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      title: "Communicate Clearly",
      description: "Be clear and honest in your communications. State your interests and intentions upfront."
    },
    {
      icon: <Users2 className="h-8 w-8 text-primary" />,
      title: "Build Connections",
      description: "Focus on building meaningful connections based on shared interests and goals."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-primary">
          Community Guidelines
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {guidelines.map((guideline, index) => (
            <div key={index} className="p-6 rounded-lg bg-primary-light">
              <div className="mb-4">
                {guideline.icon}
              </div>
              <h2 className="text-xl font-semibold mb-2 text-primary">
                {guideline.title}
              </h2>
              <p className="text-gray-text">
                {guideline.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}