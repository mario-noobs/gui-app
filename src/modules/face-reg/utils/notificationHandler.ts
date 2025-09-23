import { AxiosResponse, AxiosError } from 'axios';

export interface FaceNotificationData {
  path: string;
  code: string | number;
  message: string;
}

export const createNotificationFromResponse = (
): FaceNotificationData => {
  return {
    path,
    code: response.data?.data?.data?.code,
    message: response.data?.data?.data?.message,
  };
};

export const createNotificationFromError = (
    error: AxiosError,
    path: string
): FaceNotificationData => {
  return {
    path,
    code:
        error.response?.data?.data?.data?.code ||
        error.response?.status ||
        "ERROR",
    message:
        error.response?.data?.data?.data?.message ||
        error.message ||
        "Network Error",
  };
};

