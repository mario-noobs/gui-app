import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import {FaceNotificationData} from '../utils/notificationHandler'

interface FaceNotificationProps {
  notification: FaceNotificationData | null;
  onClose: () => void;
}

const FaceNotification: React.FC<FaceNotificationProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);

      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  if (!notification) return null;

  const isSuccess = notification.code === '0000';
  const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
  const textColor = 'text-white';
  const icon = isSuccess ? faCheckCircle : faTimesCircle;

  return (
      <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className={`${bgColor} ${textColor} rounded-lg shadow-lg p-4 min-w-80 max-w-96`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <FontAwesomeIcon icon={icon} className="text-xl mt-1" />
              <div className="flex-1">
                <div className="font-semibold mb-2">
                  {isSuccess ? 'Success' : 'Failed'}
                </div>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Path:</span> {notification.path}
                  </div>
                  <div>
                    <span className="font-medium">Code:</span> {notification.code}
                    {notification.httpStatus && (
                        <span className="ml-2">({notification.httpStatus})</span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Message:</span> {notification.message}
                  </div>
                </div>
              </div>
            </div>
            <button
                onClick={handleClose}
                className="ml-3 text-white hover:text-gray-200 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      </div>
  );
};

export default FaceNotification;