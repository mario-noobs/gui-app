import axios, { AxiosError } from "axios";

export type ErrorResponse = {
  message: string;
  code: number;
  debug: string;
  status: string;
};

export function HandleError(
  err: Error | AxiosError<ErrorResponse>
): ErrorResponse {
  if (axios.isAxiosError(err)) {
    return err.response?.data;
  } else {
    const error: ErrorResponse = {
      message: "Unknown Error",
      code: 500,
      debug: err.message,
      status: "error",
    };

    return error;
  }
}

const interceptor = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

interceptor.interceptors.request.use((config) => {
  // config.url = "https://devops-gateway.showcase.200lab.io";
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
interceptor.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("[Axios Interceptor] Error received:", error);
    console.log("[Axios Interceptor] Error status:", error.response?.status);
    console.log("[Axios Interceptor] Original request:", originalRequest);

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("[Axios Interceptor] 401 detected, attempting refresh...");
      if (isRefreshing) {
        console.log("[Axios Interceptor] Already refreshing, queueing request...");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return interceptor(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh_token");
      console.log("[Axios Interceptor] Refresh token:", refreshToken);

      if (refreshToken) {
        try {
          // Use the same baseURL as the axios instance
          const refreshUrl = `${import.meta.env.VITE_APP_API_URL || "/api"}/api/v1/user/refresh`;
          console.log("[Axios Interceptor] Calling refresh endpoint:", refreshUrl);
          const response = await axios.post(refreshUrl, {
            refresh_token: refreshToken
          });
          console.log("[Axios Interceptor] Refresh response:", response);

          const newAccessToken = response.data.data.access_token.token;
          const newRefreshToken = response.data.data.refresh_token?.token;
          
          localStorage.setItem("access_token", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("refresh_token", newRefreshToken);
          }
          
          processQueue(null, newAccessToken);
          
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          console.log("[Axios Interceptor] Retrying original request with new token...");
          return interceptor(originalRequest);
        } catch (refreshError) {
          console.log("[Axios Interceptor] Refresh failed:", refreshError);
          processQueue(refreshError, null);
          
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token available, redirect to login
        console.log("[Axios Interceptor] No refresh token, redirecting to login.");
        localStorage.removeItem("access_token");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default interceptor;
