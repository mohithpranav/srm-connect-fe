import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, MessageSquare } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-primary shadow-md pl-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end h-16">
          <div className="flex items-center space-x-4">
            <Bell className="h-6 w-6 text-white cursor-pointer hover:text-primary-light" />
            <MessageSquare className="h-6 w-6 text-white cursor-pointer hover:text-primary-light" />
            <Link to="/profile">
              <img
                className="h-8 w-8 rounded-full border-2 border-white"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150"
                alt="Profile"
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}