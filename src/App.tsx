import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Directory from './pages/Directory';
import Welcome from './pages/Welcome';
import Guidelines from './pages/Guidelines';
import Feed from './pages/Feed';
import Chats from './pages/Chats';
import StudentProfile from './pages/StudentProfile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn onSignIn={() => setIsAuthenticated(true)} />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <AuthenticatedRoute>
              <div className="min-h-screen bg-gray-light">
                <Sidebar />
                <div className="md:pl-64">
                  <Navbar />
                  <div className="p-4">
                    <Routes>
                      <Route path="/" element={<Navigate to="/feed" replace />} />
                      <Route path="/feed" element={<Feed />} />
                      <Route path="/welcome" element={<Welcome />} />
                      <Route path="/guidelines" element={<Guidelines />} />
                      <Route path="/directory" element={<Directory />} />
                      <Route path="/directory/:id" element={<StudentProfile />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/chats" element={<Chats />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </AuthenticatedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;