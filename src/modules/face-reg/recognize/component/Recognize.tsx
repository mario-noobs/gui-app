import React, { useState, useEffect } from 'react';
import { MdClear } from 'react-icons/md';
import '../style/UploadStyles.css';
import { RecognizeFaceBiometricAPI } from '../services/apis';
import { IFace } from '../../models/face';
import LoadingPage from '../../../core/components/Loading';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useFaceNotificationContext } from '../../context/FaceNotificationContextType';
import MatchIndicator from './MatchIndicator';
import { getJwtUserId } from '../../../auth/utils/jwtUtils';
import UploadForm from '../../components/UploadForm';

const Recognize = () => {
  const { profile } = useAuth();
  const { showNotification } = useFaceNotificationContext();
  const [image, setImage] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<{
    name: string;
    probability: number;
    timestamp: string;
    isMatch: boolean;
  } | null>(null);

  // Get JWT subject (user ID) once on component mount
  const jwtUserId = React.useMemo(() => {
    // First try to get from localStorage
    const storedUserId = localStorage.getItem('jwt_user_id');
    if (storedUserId) return storedUserId;

    // If not in localStorage, try to extract from token
    return getJwtUserId() || `user-${profile?.id || 'unknown'}`;
  }, [profile]);

  const handleImageChange = (img: string | null, b64: string | null) => {
    setImage(img);
    setBase64(b64);
    setRecognitionResult(null);
  };

  const handleSubmit = async () => {
    if (base64) {
      setLoading(true);
      await handleRecognizeBiometric({
        userId: jwtUserId, // Using JWT user ID instead of profile.id
        imageBase64: base64
      });
    } else {
      showNotification({
        path: '/face/recognize',
        code: 'CLIENT_ERROR',
        message: 'No image data available. Please upload an image first.',
      });
    }
  };

  const handleRecognizeBiometric = async (data: IFace) => {
    setLoading(true);
    try {
      const response = await RecognizeFaceBiometricAPI(data) as { data: any };
      const resData = response.data;
      console.log("RecognizeFaceBiometricAPI", resData);
      if (resData.code === "0000") {
        const recognitionDetails = resData.data;
        const isUserMatch = recognitionDetails?.name === jwtUserId;

        setRecognitionResult({
          // Display user's full name only if there's a match, otherwise display 'Unknown'
          name: isUserMatch ? (profile?.first_name + " " + profile?.last_name) || 'Unknown' : 'Unknown',
          probability: recognitionDetails?.probability || 0,
          timestamp: recognitionDetails?.created_at ? new Date(recognitionDetails.created_at).toLocaleString() : 'N/A',
          isMatch: isUserMatch
        });

        showNotification({
          path: '/api/v1/face/recognize',
          code: resData.code,
          message: resData.message || 'Recognition successful!',
        });
      } else {
        showNotification({
          path: '/api/v1/face/recognize',
          code: resData.code,
          message: resData.message || 'Recognition failed.',
        });
        // Clear any previous recognition result
        setRecognitionResult(null);
      }
    } catch (error: any) {
      showNotification({
        path: '/api/v1/face/recognize',
        code: 'SERVER_ERROR',
        message: error?.message || 'An error occurred during recognition.',
      });
      // Clear any previous recognition result
      setRecognitionResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClearImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    setImage(null);
    setBase64(null);
    setRecognitionResult(null);
  };

  useEffect(() => {
    // This effect can be used to react to faceData changes if necessary
  }, [base64]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="upload-container" style={{
      maxWidth: '90%',
      width: '800px',
      margin: '0 auto'
    }}>
      <UploadForm
        image={image}
        loading={loading}
        onImageChange={handleImageChange}
        buttonText="Drag & drop or click to upload your face image for recognition"
      />

      {/* Enhanced Recognition Results display */}
      {recognitionResult && (
        <div className="recognition-results" style={{
          marginTop: '25px',
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e0e0e0',
          transition: 'all 0.3s ease',
          width: '100%'
        }}>
          <h3 style={{
            marginTop: 0,
            marginBottom: '15px',
            color: '#333',
            fontSize: '1.4rem',
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '10px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '8px', color: '#3498db' }}>🔍</span>
            Recognition Results
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px',
            backgroundColor: '#f9f9f9',
            padding: '12px',
            borderRadius: '8px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '10px'
            }}>
              <span style={{
                fontSize: '0.85rem',
                color: '#666',
                marginBottom: '5px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: 500
              }}>
                User
              </span>
              <span style={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: '#333',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>👤</span>
                {recognitionResult.name}
              </span>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '10px'
            }}>
              <span style={{
                fontSize: '0.85rem',
                color: '#666',
                marginBottom: '5px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: 500
              }}>
                Timestamp
              </span>
              <span style={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: '#333',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>🕒</span>
                {recognitionResult.timestamp}
              </span>
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <div style={{
              fontSize: '0.85rem',
              color: '#666',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '6px', fontSize: '1rem' }}>📊</span>
              Confidence Score
            </div>
            <MatchIndicator probability={recognitionResult.probability} />
          </div>

          {/* Match/Unmatch Indicator */}
          <div style={{
            marginTop: '15px',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: recognitionResult.isMatch ? '#e8f5e9' : '#fce8e6',
            border: `1px solid ${recognitionResult.isMatch ? '#c8e6c9' : '#f8d7da'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: recognitionResult.isMatch ? '#2e7d32' : '#c62828',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '6px', fontSize: '1.5rem' }}>
                {recognitionResult.isMatch ? '✅' : '❌'}
              </span>
              {recognitionResult.isMatch ? 'Match' : 'Unmatch'}
            </span>
          </div>
        </div>
      )}

      <div className="button-group" style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: '20px',
        gap: '15px'
      }}>
        <button
          onClick={handleClearImage}
          className="submit-button"
          disabled={!base64}
          style={{
            flex: 1,
            padding: '12px 20px'
          }}
        >
          Clear Data
        </button>
        <button
          onClick={handleSubmit}
          className="submit-button"
          disabled={!base64 || loading}
          style={{
            flex: 1,
            padding: '12px 20px'
          }}
        >
          Recognize Face
        </button>
      </div>
    </div>
  );
};

export default Recognize;
