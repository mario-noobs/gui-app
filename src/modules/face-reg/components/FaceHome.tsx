import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserCheck, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { Typography, Button, Alert } from "@material-tailwind/react";
import { motion } from "framer-motion";
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

  // Check if the user is already registered when the component mounts
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      const jwtUserId = getJwtUserId();
      if (jwtUserId) {
        setIsLoading(true);
        try {
          const response = await apiClient.get(`/api/v1/face/is-registered?userId=${jwtUserId}`);
          const resData = response.data;
          if (resData.registered === true) {
            setIsRegistered(true);
          } else {
            setIsRegistered(false);
          }
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
      console.log(resData);
      if (resData.code === "0000") {
        showNotification({
          path: '/api/v1/face/delete-identity',
          code: resData.code,
          message: resData.message || 'Identity removed successfully!',
        });
        setIsRegistered(false);
        navigate('register'); // Navigate to register after successful removal
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
      <div className="w-full min-h-screen flex flex-col bg-gray-50">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 p-6 md:p-10 overflow-y-auto"
        >
          {/* Page Container with max width */}
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
              <Typography variant="h2" className="text-gray-800 font-bold mb-2">
                Face Recognition Control Center
              </Typography>
              <Typography variant="h6" className="text-gray-600">
                Manage your facial biometric data securely and efficiently
              </Typography>
            </div>

            {/* Full-width Panel */}
            <div className="w-full bg-white rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow">
              <div className="p-6 md:p-10">
                {/* Status Row */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <Typography variant="h4" className="text-gray-800 font-semibold">
                    Registration Status
                  </Typography>
                  <div
                      className={`px-6 py-3 rounded-full flex items-center gap-3 ${
                          isRegistered
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                      }`}
                  >
                    <FontAwesomeIcon
                        icon={isRegistered ? faUserCheck : faUserPlus}
                        className="text-lg"
                    />
                    <span className="font-medium text-base">
                    {isRegistered ? 'Registered' : 'Not Registered'}
                  </span>
                  </div>
                </div>

                {/* Alert */}
                <Alert
                    color={isRegistered ? 'green' : 'orange'}
                    className="mb-8 p-6 text-base"
                    icon={
                      <FontAwesomeIcon
                          icon={isRegistered ? faUserCheck : faUserPlus}
                          className="text-lg"
                      />
                    }
                >
                  <Typography className="font-medium text-base">
                    {isRegistered
                        ? `${profile?.last_name || 'User'} is registered for facial recognition`
                        : `${profile?.last_name || 'User'} needs to register for facial recognition`}
                  </Typography>
                </Alert>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        onClick={handleRegisterClick}
                        disabled={isRegistered || isLoading}
                        className={`w-full h-24 flex flex-col items-center justify-center gap-3 ${
                            isRegistered
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                        } transition-all duration-300 text-base`}
                        size="lg"
                    >
                      <FontAwesomeIcon icon={faUserPlus} className="text-2xl" />
                      <span className="font-medium">Register Biometric</span>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        onClick={handleRecognizeClick}
                        disabled={!isRegistered || isLoading}
                        className={`w-full h-24 flex flex-col items-center justify-center gap-3 ${
                            !isRegistered
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600'
                        } transition-all duration-300 text-base`}
                        size="lg"
                    >
                      <FontAwesomeIcon icon={faUserCheck} className="text-2xl" />
                      <span className="font-medium">Recognize Face</span>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        onClick={handleRemoveClick}
                        disabled={!isRegistered || isLoading}
                        className={`w-full h-24 flex flex-col items-center justify-center gap-3 ${
                            !isRegistered
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600'
                        } transition-all duration-300 text-base`}
                        size="lg"
                        loading={isLoading}
                    >
                      <FontAwesomeIcon icon={faUserMinus} className="text-2xl" />
                      <span className="font-medium">Remove Identity</span>
                    </Button>
                  </motion.div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 my-10" />

                {/* Outlet / Content Area */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 min-h-[400px]">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </FaceRegContext.Provider>
  );
};

export default FaceControlPage;
