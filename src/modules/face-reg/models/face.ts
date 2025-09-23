import { AxiosResponse, AxiosError } from 'axios';
import { FaceNotificationData, ApiResponseWrapper } from '../utils/notificationHandler';

export type IFace = {
    userId: string;
    imageBase64: string;
};

export const handleApiCall = async <T>(
    apiCall: () => Promise<AxiosResponse<T>>,
    path: string,
    showNotification: (data: FaceNotificationData) => void
): Promise<T | null> => {
    try {
        const response = await apiCall();
        const notificationData: FaceNotificationData = {
            path,
            code: (response.data as any)?.code ?? "UNKNOWN",
            message: (response.data as any)?.message ?? "Unknown response",
        };
        showNotification(notificationData);
        return response.data;
    } catch (error) {
        const errorResponse = error as AxiosError<ApiResponseWrapper>;
        const notificationData: FaceNotificationData = {
            path,
            code: errorResponse.response?.data?.data?.code ?? errorResponse.response?.status ?? "ERROR",
            message: errorResponse.response?.data?.data?.message ?? errorResponse.message ?? "Network Error",
        };
        showNotification(notificationData);
        return null;
    }
};