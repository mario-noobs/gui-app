import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import '../style/UploadStyles.css';
import { RegisterFaceBiometricAPI } from '../services/apis';
import LoadingPage from '../../../core/components/Loading';
import { useFaceNotificationContext } from '../../context/FaceNotificationContextType';
import UploadForm from '../../components/UploadForm';

interface RegisterContextType {
  onRegistrationStatusChange: (status: boolean) => void;
}

const Register = () => {
  const navigate = useNavigate();
  const { onRegistrationStatusChange } = useOutletContext<RegisterContextType>();
  const { showNotification } = useFaceNotificationContext();
  const [image, setImage] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (img: string | null, b64: string | null) => {
    setImage(img);
    setBase64(b64);
  };

  const handleClearImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    setImage(null);
    setBase64(null);
  };

  const handleSubmit = async () => {
    if (!base64) {
      showNotification({
        path: '/api/v1/face/register',
        code: 'CLIENT_ERROR',
        message: 'Please upload an image before submitting.',
      });
      return;
    }
    setLoading(true);
    try {
      const response = await RegisterFaceBiometricAPI({
        image_data: base64
      }) as { data: any };
      const resData = response.data;
      if (resData.code === '0000') {
        showNotification({
          path: '/api/v1/face/register',
          code: resData.code,
          message: resData.message || 'Registration successful!',
        });
        setImage(null);
        setBase64(null);
        onRegistrationStatusChange(true);
        navigate('/face-regconize/recognize');
      } else {
        showNotification({
          path: '/api/v1/face/register',
          code: resData.code,
          message: resData.message || 'Registration failed.',
        });
      }
    } catch (error: any) {
      showNotification({
        path: '/api/v1/face/register',
        code: 'SERVER_ERROR',
        message: error?.message || 'An error occurred during registration.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="upload-container">
      <UploadForm
        image={image}
        loading={loading}
        onImageChange={handleImageChange}
        buttonText="Drag & drop or click to upload your face image for registration"
      />
      <div className="button-group" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '20px', gap: '15px' }}>
        <button
          onClick={handleClearImage}
          className="submit-button"
          disabled={!base64}
          style={{ flex: 1, padding: '12px 20px' }}
        >
          Clear Data
        </button>
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={!base64 || loading}
          style={{ flex: 1, padding: '12px 20px' }}
        >
          Register Face
        </button>
      </div>
    </div>
  );
};

export default Register;
