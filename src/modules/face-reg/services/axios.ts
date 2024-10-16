import axios, { AxiosError } from "axios";

// Define the structure of the error response
export type ErrorResponse = {
  message: string;
  code: number;
  debug: string;
  status: string;
};

// Function to handle errors
export function handleError(err: Error | AxiosError<ErrorResponse>): ErrorResponse {
  if (axios.isAxiosError(err)) {
    return {
      message: err.response?.data.message || "Request failed",
      code: err.response?.status || 500,
      debug: err.message,
      status: "error",
    };
  } else {
    return {
      message: "Unknown Error",
      code: 500,
      debug: err.message,
      status: "error",
    };
  }
}

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "https://omari.id.vn",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authorization token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  // Handle request error
  return Promise.reject(handleError(error));
});

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    // Handle response errors
    return Promise.reject(handleError(error));
  }
);

export default apiClient;