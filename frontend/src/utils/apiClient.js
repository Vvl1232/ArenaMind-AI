import axios from "axios";

// Create a configured axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 30000, // Global 30s timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Global Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // We could attach auth tokens here if needed
    return config;
  },
  (error) => Promise.reject(error),
);

// Global Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg =
      error.response?.data?.detail ||
      error.message ||
      "An unexpected error occurred connecting to the server.";

    console.error("[API Error]:", errorMsg);

    // Convert to a standardized error object
    return Promise.reject(new Error(errorMsg));
  },
);

export default apiClient;
