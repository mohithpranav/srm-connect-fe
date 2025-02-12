import api from "../utils/axios";

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  gender: string;
}

interface VerifyOtpData {
  email: string;
  otp: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface ResetPasswordData {
  email: string;
  resetToken: string;
  newPassword: string;
}

export const authService = {
  async initiateSignup(data: SignUpData) {
    const response = await api.post("/signup", data);
    return response.data;
  },

  async verifyOtp(data: VerifyOtpData) {
    const response = await api.post("/verifyOtpController", data);
    return response.data;
  },

  async resendOtp(email: string) {
    const response = await api.post("/resendOtp", { email });
    return response.data;
  },

  async signin(data: SignInData) {
    const response = await api.post("/signin", data);
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  },

  async verifyResetOtp(data: { email: string; otp: string }) {
    const response = await api.post("/verify-reset-otp", data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordData) {
    const response = await api.post("/reset-password", data);
    return response.data;
  },
};
