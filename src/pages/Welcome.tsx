import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function Welcome() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold mb-6 text-primary">
              Everyone is waiting for Hello world!
            </h1>
            <h2 className="text-xl font-semibold mb-4 text-gray-dark">
              Say it first...
            </h2>
            <p className="text-gray-text mb-6 leading-relaxed">
              Don't wait around for someone else to break the ice! Take the
              first step, say hello, and watch what happens next. You might
              just stumble into a lifelong friendship, find that perfect
              hackathon teammate, or even meet your future co-founder. The
              adventure starts with you making the first move—so go ahead,
              dive in and get chatting!
            </p>
            <button 
              className="flex items-center space-x-2 px-6 py-3 rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Just say Hi</span>
            </button>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=2574&h=1932"
              alt="Students chatting"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}