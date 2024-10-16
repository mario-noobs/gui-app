import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import '../styles/FaceControlPage.css';
import { useAuth } from '../../auth/hooks/useAuth';

const FaceControlPage = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleRegisterClick = () => {
    setIsRegistered(true);
    navigate('/face-regconize/register');
  };

  const handleRecognizeClick = () => {
    setIsRegistered(false);
    navigate('/face-regconize/recognize');
  };

  return (
    <div className="face-control-container">
      <div className="status-message">
        {isRegistered ? (
          <span className="status-registered">
            <FontAwesomeIcon icon={faUserCheck} /> {profile?.last_name} registered
          </span>
        ) : (
          <span className="status-not-registered">
            <FontAwesomeIcon icon={faUserPlus} /> {profile?.last_name} not registered
          </span>
        )}
      </div>
      <div className="button-container">
        <button className="action-button" onClick={handleRegisterClick}>
          <FontAwesomeIcon icon={faUserPlus} /> Register Facial Biometric
        </button>
        <button className="action-button" onClick={handleRecognizeClick}>
          <FontAwesomeIcon icon={faUserCheck} /> Recognize Using Biometric
        </button>
        <button className="action-button" onClick={handleRecognizeClick}>
          <FontAwesomeIcon icon={faUserCheck} /> Remove Identity
        </button>

      </div>
      <Outlet />
    </div>
  );
};

export default FaceControlPage;
