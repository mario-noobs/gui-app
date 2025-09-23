import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserCheck, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { Card, Typography } from "@material-tailwind/react";
import '../styles/FaceControlPage.css';
import { useAuth } from '../../auth/hooks/useAuth';
import { FaceNotificationProvider } from '../context/FaceNotificationContextType';

const FaceControlPage = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleRegistrationStatusChange = (registered: boolean) => {
    setIsRegistered(registered);
  };

  const handleRegisterClick = () => {
    navigate('register');
  };

  const handleRecognizeClick = () => {
    navigate('recognize');
  };

  const handleRemoveClick = () => {
    setIsRegistered(false);
  };

  return (
    <FaceNotificationProvider>
      <div className="face-control-container">
        <Card className="mb-6">
          <div className="p-6">
            <Typography variant="h4" color="blue-gray" className="mb-2">
              Face Recognition Control
            </Typography>
            <div className="status-message">
              {isRegistered ? (
                <span className="status-registered">
                  <FontAwesomeIcon icon={faUserCheck} /> {profile?.last_name || 'User'} is registered
                </span>
              ) : (
                <span className="status-not-registered">
                  <FontAwesomeIcon icon={faUserPlus} /> {profile?.last_name || 'User'} is not registered
                </span>
              )}
            </div>
            <div className="button-container">
              <button
                className={`action-button ${!isRegistered ? '' : 'disabled'}`}
                onClick={handleRegisterClick}
                disabled={isRegistered}
              >
                <FontAwesomeIcon icon={faUserPlus} />
                Register Facial Biometric
              </button>
              <button
                className={`action-button ${isRegistered ? '' : 'disabled'}`}
                onClick={handleRecognizeClick}
                disabled={!isRegistered}
              >
                <FontAwesomeIcon icon={faUserCheck} />
                Recognize Using Biometric
              </button>
              <button
                className={`action-button ${isRegistered ? '' : 'disabled'}`}
                onClick={handleRemoveClick}
                disabled={!isRegistered}
              >
                <FontAwesomeIcon icon={faUserMinus} />
                Remove Identity
              </button>
            </div>
          </div>
        </Card>
        <Card className="content-area">
          <Outlet context={{ onRegistrationStatusChange: handleRegistrationStatusChange }} />
        </Card>
      </div>
    </FaceNotificationProvider>
  );
};

export default FaceControlPage;
