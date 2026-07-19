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
  async (error) => {
    const config = error.config;
    
    // Retry Logic: max 2 retries
    if (config && (!config._retryCount || config._retryCount < 2)) {
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || (error.response && error.response.status >= 500)) {
        config._retryCount = config._retryCount || 0;
        config._retryCount += 1;
        
        // Exponential backoff
        const delay = Math.pow(2, config._retryCount) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        
        return apiClient(config);
      }
    }

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
