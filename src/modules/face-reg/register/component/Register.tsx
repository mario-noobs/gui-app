import React, { useState } from 'react';
import { MdCloudUpload } from 'react-icons/md';
import '../style/UploadStyles.css';
import { RegisterFaceBiometricAPI } from '../services/apis';
import { IFace } from '../../models/face';
import LoadingPage from '../../../core/components/Loading';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useFaceNotificationContext } from '../../context/FaceNotificationContextType';

interface RegisterProps {
  onRegistrationStatusChange: (status: boolean) => void;
}

interface RegisterFaceResponseData {
  code: string;
  message: string;
  userId?: string;
  requestId?: string;
  data?: {
    name?: string;
    probability?: number | null;
    created_at?: string;
    image?: string | null;
  };
}

const Register = ({ onRegistrationStatusChange }: RegisterProps) => {
  const { profile } = useAuth();
  const { showNotification } = useFaceNotificationContext();
  const [image, setImage] = useState<string | null>(null);
  const [faceData, setFaceData] = useState<IFace | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          setImage(reader.result);
          setFaceData({
            userId: profile?.last_name || "None",
            imageBase64: base64String
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          setImage(reader.result);
          setFaceData({
            userId: profile?.last_name || "None",
            imageBase64: base64String
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (faceData) {
      setLoading(true);
      await handleRegisterBiometric(faceData);
    } else {
      showNotification({
        path: '/face/register',
        code: 'CLIENT_ERROR',
        message: 'No image data available. Please upload an image first.',
      });
    }
  };

  const handleRegisterBiometric = async (data: IFace) => {
    setLoading(true);
    try {
      const response = await RegisterFaceBiometricAPI<{ data: RegisterFaceResponseData }>(data);
      const resData = response.data;
      if (resData.code === "0000") {
        showNotification({
          path: '/api/v1/face/register-identity',
          code: resData.code,
          message: resData.message || 'Registration successful!',
        });
        onRegistrationStatusChange(true);
      } else {
        showNotification({
          path: '/api/v1/face/register-identity',
          code: resData.code,
          message: resData.message || 'Registration failed.',
        });
        onRegistrationStatusChange(false);
      }
    } catch (error: any) {
      showNotification({
        path: '/api/v1/face/register-identity',
        code: 'SERVER_ERROR',
        message: error?.message || 'An error occurred during registration.',
      });
      onRegistrationStatusChange(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="upload-container">
      <div
        className="image-drop-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => {
          const input = document.getElementById('file-input');
          if (input) (input as HTMLInputElement).click();
        }}
      >
        {image ? (
          <img src={image} alt="Uploaded" className="uploaded-image" />
        ) : (
          <div className="upload-icon">
            <MdCloudUpload size={50} />
            <p>Drag & drop an image here or click to upload</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
              id="file-input"
              style={{ display: 'none' }}
            />
          </div>
        )}
      </div>
      <button onClick={handleSubmit} className="submit-button">
        Submit Data
      </button>
    </div>
  );
};

export default Register;
