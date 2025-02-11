import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  AlertCircle,
  GraduationCap,
  Users,
  BookOpen,
  MessageSquare,
  User,
} from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Simulated OTP for demo (in real app, this would be sent via email/SMS)
  const dummyOtp = "123456";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSendOtp = () => {
    if (!formData.email) {
      setError("Please enter your email");
      return;
    }
    setIsOtpSent(true);
    setError("");
    // In a real application, you would send the OTP to the user's email here
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.firstName || !formData.lastName) {
      setError("Please enter your full name");
      return;
    }

    if (!formData.email) {
      setError("Please enter your email");
      return;
    }

    if (!isOtpSent) {
      handleSendOtp();
      return;
    }

    if (formData.otp !== dummyOtp) {
      setError("Invalid OTP. For demo, use: 123456");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    navigate("/signin");
  };

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Connect with Peers",
      description: "Find and connect with students who share your interests",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Study Groups",
      description: "Form study groups and collaborate on projects",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Campus Chat",
      description: "Stay connected with real-time messaging",
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-light">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-primary">
              Join CampusConnect
            </h1>
            <p className="text-gray-text mt-2">
              Your journey to meaningful connections starts here
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-text mb-1">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-text h-5 w-5" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your first name"
                  required
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-text mb-1">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-text h-5 w-5" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-text mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-text h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* OTP Section */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-text">
                  OTP
                </label>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  {isOtpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
              />
              {isOtpSent && (
                <p className="text-sm text-primary mt-1">
                  For demo, use: 123456
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-text mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-text h-5 w-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Create password"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-text mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-text h-5 w-5" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-medium bg-primary hover:bg-primary-dark transition-colors"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-gray-text">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="font-medium text-primary hover:text-primary-dark hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2071&h=1381"
          alt="Students collaborating"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent flex flex-col justify-end p-12">
          <h2 className="text-3xl font-bold text-white mb-8">
            Why Join CampusConnect?
          </h2>
          <div className="grid gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="p-2 rounded-lg bg-primary">{feature.icon}</div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-gray-200">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
