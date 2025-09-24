import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserCheck, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { Card, Typography, Button, Alert } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { useAuth } from '../../auth/hooks/useAuth';
import { useFaceNotificationContext } from '../context/FaceNotificationContextType';
import axios from '../services/axios';

const FaceControlPage = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { showNotification } = useFaceNotificationContext();

  const handleRegistrationStatusChange = (registered: boolean) => {
    setIsRegistered(registered);
  };

  const handleRegisterClick = () => {
    navigate('register');
  };

  const handleRecognizeClick = () => {
    navigate('recognize');
  };

  const handleRemoveClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`/api/v1/face/identity/${profile?.last_name}`);
      const resData = response.data;

      if (resData.code === "0000") {
        showNotification({
          path: '/api/v1/face/identity',
          code: resData.code,
          message: resData.message || 'Identity removed successfully!',
        });
        setIsRegistered(false);
      } else {
        showNotification({
          path: '/api/v1/face/identity',
          code: resData.code,
          message: resData.message || 'Failed to remove identity.',
        });
      }
    } catch (error: unknown) {
      showNotification({
        path: '/api/v1/face/identity',
        code: 'SERVER_ERROR',
        message: error instanceof Error ? error.message : 'An error occurred while removing identity.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="h-full overflow-y-auto bg-gray-100 p-6 flex justify-center">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-6xl space-y-6"
        >
          {/* Header Section */}
          <div className="text-center mb-6">
            <Typography variant="h3" className="text-gray-800 font-bold mb-2">
              Face Recognition Control Center
            </Typography>
            <Typography className="text-gray-600">
              Manage your facial biometric data securely and efficiently
            </Typography>
          </div>

          {/* Status Card */}
          <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-shadow w-full">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
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

              <Alert
                  color={isRegistered ? "green" : "orange"}
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
                {/* Register Button */}
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

                {/* Recognize Button */}
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

                {/* Remove Button */}
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
            </div>
          </Card>

          {/* Content Area */}
          <Card className="shadow-lg border border-gray-200 w-full">
            <div className="p-8 bg-gray-50 rounded-xl min-h-[400px]">
              <Outlet context={{ onRegistrationStatusChange: handleRegistrationStatusChange }} />
            </div>
          </Card>
        </motion.div>
      </div>
  );
};

export default FaceControlPage;
