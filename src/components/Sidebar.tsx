import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Users, Info, MessageSquare, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary md:hidden"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-dark/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`} style={{ width: '16rem' }}>
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-8">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">CampusConnect</span>
          </div>
          
          <nav className="space-y-2">
            {[
              { path: '/feed', icon: <Home className="h-5 w-5" />, label: 'Home' },
              { path: '/welcome', icon: <BookOpen className="h-5 w-5" />, label: 'Welcome' },
              { path: '/guidelines', icon: <Info className="h-5 w-5" />, label: 'Guidelines' },
              { path: '/directory', icon: <Users className="h-5 w-5" />, label: 'Directory' },
              { path: '/chats', icon: <MessageSquare className="h-5 w-5" />, label: 'Chats' }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-text hover:bg-primary-light hover:text-primary'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}