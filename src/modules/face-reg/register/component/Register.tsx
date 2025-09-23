import React, { useState } from 'react';
import { MdCloudUpload } from 'react-icons/md';
import '../style/UploadStyles.css';
import { RegisterFaceBiometricAPI } from '../services/apis';
import { IFace, IFaceResponse } from '../../models/face';
import LoadingPage from '../../../core/components/Loading';
import { AxiosError } from 'axios';
import { ErrorResponse, HandleError } from '../../../core/services/axios';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useSnackbar } from 'notistack';

interface RegisterProps {
  onRegistrationStatusChange: (status: boolean) => void;
}

const Register = ({ onRegistrationStatusChange }: RegisterProps) => {
  const { profile } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
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
      await HandleRegisterBiometric(faceData);
    } else {
      console.log('No image data available');
    }
  };

  const HandleRegisterBiometric = async (data: IFace) => {
    try {
      const result = await RegisterFaceBiometricAPI<IFaceResponse>(data);
      if (result.code === "0000") {
        onRegistrationStatusChange(true);
      } else {
        onRegistrationStatusChange(false);
      }
    } catch (error) {
      enqueueSnackbar(
        HandleError(error as Error | AxiosError<ErrorResponse>).message,
        { variant: 'error' }
      );
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
