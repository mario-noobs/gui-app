import axios, { AxiosError } from "axios";

export type ErrorResponse = {
  message: string;
};

export function HandleError(
  err: Error | AxiosError
): ErrorResponse {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    // Backend returns { error: { code, message }, traceId }
    const message = data?.error?.message || data?.message || err.message;
    return { message };
  } else {
    return { message: err.message || "Unknown Error" };
  }
}

const interceptor = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth endpoints that should not trigger token refresh
const AUTH_ENDPOINTS = [
  "/api/v1/user/authenticate",
  "/api/v1/user/register",
  "/api/v1/user/refresh",
  "/api/v1/user/logout",
];

const isAuthEndpoint = (url: string | undefined): boolean => {
  if (!url) return false;
  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

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

    // Skip token refresh logic for auth endpoints
    if (isAuthEndpoint(originalRequest?.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return interceptor(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          const refreshUrl = `/api/v1/user/refresh`;
          const response = await axios.post(refreshUrl, {
            refresh_token: refreshToken,
          });

          const newAccessToken = response.data.data.access_token.token;
          const newRefreshToken = response.data.data.refresh_token?.token;

          localStorage.setItem("access_token", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("refresh_token", newRefreshToken);
          }

          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return interceptor(originalRequest);
        } catch (refreshError) {
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
        localStorage.removeItem("access_token");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default interceptor;
