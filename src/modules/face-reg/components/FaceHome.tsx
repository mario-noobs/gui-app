import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserCheck, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { Card, Typography } from "@material-tailwind/react";
import '../styles/FaceControlPage.css';
import { useAuth } from '../../auth/hooks/useAuth';

const FaceControlPage = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleRegisterClick = () => {
    setIsRegistered(true);
    navigate('register');
  };

  const handleRecognizeClick = () => {
    setIsRegistered(false);
    navigate('recognize');
  };

  const handleRemoveClick = () => {
    setIsRegistered(false);
    // TODO: Implement remove identity functionality
  };

  return (
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
              className="action-button"
              onClick={handleRegisterClick}
            >
              <FontAwesomeIcon icon={faUserPlus} />
              Register Facial Biometric
            </button>
            <button
              className="action-button"
              onClick={handleRecognizeClick}
            >
              <FontAwesomeIcon icon={faUserCheck} />
              Recognize Using Biometric
            </button>
            <button
              className="action-button"
              onClick={handleRemoveClick}
            >
              <FontAwesomeIcon icon={faUserMinus} />
              Remove Identity
            </button>
          </div>
        </div>
      </Card>
      <Card className="content-area">
        <Outlet />
      </Card>
    </div>
  );
};

export default FaceControlPage;
