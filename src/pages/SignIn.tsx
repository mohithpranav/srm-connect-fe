import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, GraduationCap } from 'lucide-react';

interface SignInProps {
  onSignIn: () => void;
}

export default function SignIn({ onSignIn }: SignInProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === 'admin' && password === 'admin') {
      onSignIn();
      navigate('/feed');
    } else {
      setError('Invalid credentials. Use admin/admin to sign in.');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-light">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-primary">Welcome Back!</h1>
            <p className="text-gray-text mt-2">Your campus community awaits</p>
            <p className="text-sm text-gray-text mt-2">Use admin/admin to sign in</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-dark mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-text h-5 w-5" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-dark mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-text h-5 w-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-medium transition-colors bg-primary hover:bg-primary-dark"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-gray-text">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="font-medium text-primary hover:text-primary-dark hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Image and Text */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2070&h=1380"
          alt="Students studying together"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
          <div className="text-white max-w-lg">
            <h2 className="text-3xl font-bold mb-4">Connect. Collaborate. Create.</h2>
            <p className="text-lg">
              Join thousands of students in your campus community. Share ideas, find study partners,
              and build lasting connections that go beyond the classroom.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}