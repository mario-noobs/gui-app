import { useState } from 'react';
import { FaceNotificationData } from '../utils/notificationHandler';

export const useFaceNotification = () => {
  const [notification, setNotification] = useState<FaceNotificationData | null>(null);

  const showNotification = (data: FaceNotificationData) => {
    setNotification(data);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return { notification, showNotification, hideNotification };
};