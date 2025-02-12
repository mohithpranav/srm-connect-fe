import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle, GraduationCap } from "lucide-react";
import { authService } from "../services/auth.service";
import { toast } from "sonner";

interface SignInProps {
  onSignIn: () => void;
}

export default function SignIn({ onSignIn }: SignInProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [resetToken, setResetToken] = useState<string>("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.signin({ email, password });

      // Store token and user data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      toast.success("Signed in successfully!");
      onSignIn();
      navigate("/feed");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!isOtpSent) {
        await authService.forgotPassword(resetEmail);
        setIsOtpSent(true);
        toast.success("Reset code sent to your email");
      } else if (!isOtpVerified) {
        const response = await authService.verifyResetOtp({
          email: resetEmail,
          otp: resetOtp,
        });
        setResetToken(response.resetToken);
        setIsOtpVerified(true);
        toast.success("Code verified successfully");
      } else {
        await authService.resetPassword({
          email: resetEmail,
          resetToken,
          newPassword,
        });
        toast.success("Password reset successfully");
        setShowForgotPassword(false);
        // Clear reset states
        setResetEmail("");
        setResetOtp("");
        setNewPassword("");
        setResetToken("");
        setIsOtpSent(false);
        setIsOtpVerified(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to process request");
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex bg-gray-light">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-primary">
                Reset Password
              </h1>
              <p className="text-gray-text mt-2">
                {!isOtpSent
                  ? "Enter your email to receive a reset code"
                  : !isOtpVerified
                  ? "Enter the code sent to your email"
                  : "Enter your new password"}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 flex items-center text-red-700">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-6">
              {!isOtpSent && (
                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
              )}

              {isOtpSent && !isOtpVerified && (
                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-1">
                    Reset Code
                  </label>
                  <input
                    type="text"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter reset code"
                    required
                    disabled={isLoading}
                  />
                </div>
              )}

              {isOtpVerified && (
                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter new password"
                    required
                    disabled={isLoading}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg text-white font-medium transition-colors bg-primary hover:bg-primary-dark ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading
                  ? "Processing..."
                  : !isOtpSent
                  ? "Send Reset Code"
                  : !isOtpVerified
                  ? "Verify Code"
                  : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail("");
                  setResetOtp("");
                  setNewPassword("");
                  setIsOtpSent(false);
                  setIsOtpVerified(false);
                  setError("");
                }}
                className="w-full text-center text-gray-text hover:text-gray-dark"
              >
                Back to Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-sm text-gray-text mt-2">
              Use admin/admin to sign in
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-dark mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-text h-5 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-dark mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-text h-5 w-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-primary hover:text-primary-dark mt-1"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg text-white font-medium transition-colors bg-primary hover:bg-primary-dark ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-text">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
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
            <h2 className="text-3xl font-bold mb-4">
              Connect. Collaborate. Create.
            </h2>
            <p className="text-lg">
              Join thousands of students in your campus community. Share ideas,
              find study partners, and build lasting connections that go beyond
              the classroom.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
