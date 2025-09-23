import { useState, useCallback } from 'react';
import { FaceNotificationData } from '../components/FaceNotification';

export const useFaceNotification = () => {
  const [notification, setNotification] = useState<FaceNotificationData | null>(null);

  const showNotification = useCallback((data: FaceNotificationData) => {
    setNotification(data);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    notification,
    showNotification,
    hideNotification,
  };
};