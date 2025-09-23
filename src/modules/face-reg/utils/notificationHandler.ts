import { AxiosError } from 'axios';

export interface FaceNotificationData {
  path: string;
  code: string | number;
  message: string;
}

export interface ApiResponse {
  code: string | number;
  message: string;
  data?: any;
}

export interface ApiResponseWrapper {
  data: ApiResponse;
}

export const createNotificationFromResponse = (
  response: ApiResponseWrapper,
  path: string
): FaceNotificationData => {
  return {
    path,
    code: response.data.code ?? "UNKNOWN",
    message: response.data.message ?? "Unknown response",
  };
};

export const createNotificationFromError = (
  error: AxiosError<ApiResponseWrapper>,
  path: string
): FaceNotificationData => {
  return {
    path,
    code:
      error.response?.data?.code ??
      error.response?.status ??
      "ERROR",
    message:
      error.response?.data?.message ??
      error.message ??
      "Network Error",
  };
};
