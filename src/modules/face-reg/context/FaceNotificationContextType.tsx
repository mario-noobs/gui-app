import React, { createContext, useContext, ReactNode } from 'react';
import { useFaceNotification } from '../hooks/useFaceNotification';
import FaceNotification, { FaceNotificationData } from '../components/FaceNotification';

interface FaceNotificationContextType {
  showNotification: (data: FaceNotificationData) => void;
  hideNotification: () => void;
}

const FaceNotificationContext = createContext<FaceNotificationContextType | undefined>(undefined);

export const useFaceNotificationContext = () => {
  const context = useContext(FaceNotificationContext);
  if (!context) {
    throw new Error('useFaceNotificationContext must be used within FaceNotificationProvider');
  }
  return context;
};

interface FaceNotificationProviderProps {
  children: ReactNode;
}

export const FaceNotificationProvider: React.FC<FaceNotificationProviderProps> = ({ children }) => {
  const { notification, showNotification, hideNotification } = useFaceNotification();

  return (
      <FaceNotificationContext.Provider value={{ showNotification, hideNotification }}>
        {children}
        <FaceNotification notification={notification} onClose={hideNotification} />
      </FaceNotificationContext.Provider>
  );
};