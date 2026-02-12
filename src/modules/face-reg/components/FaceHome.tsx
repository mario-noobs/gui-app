import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserCheck, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { Typography, Button, Alert } from "@material-tailwind/react";
import { useAuth } from '../../auth/hooks/useAuth';
import { useFaceNotificationContext } from '../context/FaceNotificationContextType';
import apiClient from '../services/axios';
import { getJwtUserId } from '../../auth/utils/jwtUtils';
import { FaceRegContext } from './ProtectedRoute';

const FaceControlPage = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { showNotification } = useFaceNotificationContext();

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      const jwtUserId = getJwtUserId();
      if (jwtUserId) {
        setIsLoading(true);
        try {
          const response = await apiClient.get(`/api/v1/face/is-registered?userId=${jwtUserId}`);
          const resData = response.data;
          setIsRegistered(resData.registered === true);
        } catch (error) {
          setIsRegistered(false);
          console.error('Error checking registration status:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkRegistrationStatus();
  }, [profile]);

  const handleRegisterClick = () => {
    if (!isRegistered) {
      navigate('register');
    } else {
      showNotification({
        path: '/face/register',
        code: 'ALREADY_REGISTERED',
        message: 'You are already registered. Cannot register again.',
      });
    }
  };

  const handleRecognizeClick = () => {
    if (isRegistered) {
      navigate('recognize');
    } else {
      showNotification({
        path: '/face/recognize',
        code: 'NOT_REGISTERED',
        message: 'You must register before you can recognize.',
      });
    }
  };

  const handleRemoveClick = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/api/v1/face/delete-identity', {});
      const resData = response.data.data;
      if (resData.code === "0000") {
        showNotification({
          path: '/api/v1/face/delete-identity',
          code: resData.code,
          message: resData.message || 'Identity removed successfully!',
        });
        setIsRegistered(false);
        navigate('register');
      } else {
        showNotification({
          path: '/api/v1/face/delete-identity',
          code: resData.code,
          message: resData.message || 'Failed to remove identity.',
        });
      }
    } catch (error: unknown) {
      showNotification({
        path: '/api/v1/face/delete-identity',
        code: 'SERVER_ERROR',
        message: error instanceof Error ? error.message : 'An error occurred while removing identity.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FaceRegContext.Provider value={{ isRegistered, setIsRegistered }}>
      <div className="w-full h-full overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Page header */}
          <div className="mb-6">
            <Typography variant="h4" className="text-gray-900 font-semibold">
              Face Recognition
            </Typography>
            <Typography className="text-gray-500 text-sm mt-1">
              Manage your facial biometric data
            </Typography>
          </div>

          {/* Status + Actions card */}
          <div className="bg-white border border-gray-200 rounded-lg mb-6">
            <div className="p-5">
              {/* Status */}
              <div className="flex items-center justify-between mb-4">
                <Typography className="text-sm text-gray-700 font-medium">
                  Registration Status
                </Typography>
                <span
                  className={`text-xs font-medium rounded px-2.5 py-1 ${
                    isRegistered
                      ? 'text-green-700 bg-green-50'
                      : 'text-yellow-700 bg-yellow-50'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={isRegistered ? faUserCheck : faUserPlus}
                    className="mr-1.5"
                  />
                  {isRegistered ? 'Registered' : 'Not Registered'}
                </span>
              </div>

              {/* Alert */}
              <Alert
                color={isRegistered ? 'green' : 'amber'}
                className="mb-5 py-3 text-sm"
                icon={
                  <FontAwesomeIcon
                    icon={isRegistered ? faUserCheck : faUserPlus}
                  />
                }
              >
                {isRegistered
                  ? `${profile?.last_name || 'User'} is registered for facial recognition`
                  : `${profile?.last_name || 'User'} needs to register for facial recognition`}
              </Alert>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  onClick={handleRegisterClick}
                  disabled={isRegistered || isLoading}
                  className={`flex items-center justify-center gap-2 py-3 text-sm ${
                    isRegistered
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  size="sm"
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                  Register
                </Button>
                <Button
                  onClick={handleRecognizeClick}
                  disabled={!isRegistered || isLoading}
                  className={`flex items-center justify-center gap-2 py-3 text-sm ${
                    !isRegistered
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  size="sm"
                >
                  <FontAwesomeIcon icon={faUserCheck} />
                  Recognize
                </Button>
                <Button
                  onClick={handleRemoveClick}
                  disabled={!isRegistered || isLoading}
                  className={`flex items-center justify-center gap-2 py-3 text-sm ${
                    !isRegistered
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                  size="sm"
                  loading={isLoading}
                >
                  <FontAwesomeIcon icon={faUserMinus} />
                  Remove
                </Button>
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 min-h-[400px]">
            <Outlet />
          </div>
        </div>
      </div>
    </FaceRegContext.Provider>
  );
};

export default FaceControlPage;
