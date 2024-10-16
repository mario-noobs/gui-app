import React, { useState, useEffect } from 'react';
import { MdCloudUpload } from 'react-icons/md';
import '../style/UploadStyles.css';
import { RecognizeFaceBiometricAPI, RegisterFaceBiometricAPI } from '../services/apis';
import { IFace, IFaceResponse } from '../../models/face';
import LoadingPage from '../../../core/components/Loading';
import { AxiosError } from 'axios';
import { ErrorResponse, HandleError } from '../../../core/services/axios';
import { useAuth } from '../../../auth/hooks/useAuth';

const Recognize = () => {
  const {profile} = useAuth();
  const [image, setImage] = useState(null);
  const [faceResponse, setFaceResponse] = useState<IFaceResponse | null>(null);
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
          imageBase64: base64String }); // Assuming `image` is a field in IFace
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
            imageBase64: base64String }); // Save only the Base64 string without prefix
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
      const result = await RecognizeFaceBiometricAPI<IFaceResponse>(data);
      setFaceResponse(result);
    } catch (error) {
      enqueueSnackbar(
        HandleError(error as Error | AxiosError<ErrorResponse>).message,
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // This effect can be used to react to faceData changes if necessary
  }, [faceData]);

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

export default Recognize;
function enqueueSnackbar(message: string, arg1: { variant: string; }) {
  throw new Error('Function not implemented.');
}

