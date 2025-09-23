import React, { useState, useEffect } from 'react';
import { MdCloudUpload } from 'react-icons/md';
import '../style/UploadStyles.css';
import { RecognizeFaceBiometricAPI } from '../services/apis';
import { IFace, IFaceResponse } from '../../models/face';
import LoadingPage from '../../../core/components/Loading';
import { AxiosError } from 'axios';
import { ErrorResponse, HandleError } from '../../../core/services/axios';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useSnackbar } from 'notistack';

const Recognize = () => {
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
      await handleRecognizeBiometric(faceData);
    } else {
      console.log('No image data available');
    }
  };

  const handleRecognizeBiometric = async (data: IFace) => {
    try {
      await RecognizeFaceBiometricAPI<IFaceResponse>(data);
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
      {/* Optionally display faceResponse here */}
    </div>
  );
};

export default Recognize;
