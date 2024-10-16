import React, { useState, useEffect } from 'react';
import { MdCloudUpload } from 'react-icons/md';
import '../style/UploadStyles.css';
import { RegisterFaceBiometricAPI } from '../services/apis';
import { IFace, IFaceResponse } from '../../models/face';
import LoadingPage from '../../../core/components/Loading';
import { AxiosError } from 'axios';
import { ErrorResponse, HandleError } from '../../../core/services/axios';
import { useAuth } from '../../../auth/hooks/useAuth';

const Register = ({ onRegistrationStatusChange }) => {
  const { profile } = useAuth();
  const [image, setImage] = useState(null);
  const [faceData, setFaceData] = useState<IFace | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1]; // Remove prefix
          setImage(reader.result); // Keep full Base64 for display
          setFaceData({ 
            userId: profile?.last_name || "None",
            imageBase64: base64String 
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1]; // Remove prefix
          setImage(reader.result); // Keep full Base64 for display
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
        onRegistrationStatusChange(true); // Update registration status
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
        onClick={() => document.getElementById('file-input').click()}
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
              style={{ display: 'none' }} // Hide the default file input
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
