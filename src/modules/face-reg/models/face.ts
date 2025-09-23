import { AxiosResponse, AxiosError } from 'axios';
import { FaceNotificationData } from '../utils/notificationHandler';

export type IFace = {
    userId: string
    imageBase64: string
  };

export type IFaceResponse = {
    code: string
    message: string
};

export interface ApiResponse {
  code: string | number;
  message: string;
  data?: any;
}

export const createNotificationFromResponse = (
    response: AxiosResponse<ApiResponse>,
    path: string
): FaceNotificationData => {
  return {
    path,
    code: response.data.code,
    message: response.data.message,
    httpStatus: response.status,
  };
};

export const createNotificationFromError = (
    error: AxiosError<ApiResponse>,
    path: string
): FaceNotificationData => {
  return {
    path,
    code: error.response?.data?.code || error.response?.status || 'ERROR',
    message: error.response?.data?.message || error.message || 'Network Error',
    httpStatus: error.response?.status,
  };
};

export const handleApiCall = async <T>(
    apiCall: () => Promise<AxiosResponse<T>>,
    path: string,
    showNotification: (data: FaceNotificationData) => void
): Promise<T | null> => {
  try {
    const response = await apiCall();
    const notificationData = createNotificationFromResponse(response as AxiosResponse<ApiResponse>, path);
    showNotification(notificationData);
    return response.data;
  } catch (error) {
    const notificationData = createNotificationFromError(error as AxiosError<ApiResponse>, path);
    showNotification(notificationData);
    return null;
  }
};