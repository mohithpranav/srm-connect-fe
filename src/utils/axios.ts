import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Update response interceptor with better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error);

    if (error.response?.status === 401) {
      if (!window.location.pathname.includes("/signin")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
