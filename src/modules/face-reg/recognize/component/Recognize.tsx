import React, { useState, useEffect } from 'react';
import { MdCloudUpload, MdClear } from 'react-icons/md';
import '../style/UploadStyles.css';
import { RecognizeFaceBiometricAPI } from '../services/apis';
import { IFace } from '../../models/face';
import LoadingPage from '../../../core/components/Loading';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useFaceNotificationContext } from '../../context/FaceNotificationContextType';
import { ApiResponseWrapper } from '../../utils/notificationHandler';

const Recognize = () => {
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

  const handleClearImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    setImage(null);
    setFaceData(null);
  };

  const handleSubmit = async () => {
    if (faceData) {
      setLoading(true);
      await handleRecognizeBiometric(faceData);
    } else {
      showNotification({
        path: '/face/recognize',
        code: 'CLIENT_ERROR',
        message: 'No image data available. Please upload an image first.',
      });
    }
  };

  const handleRecognizeBiometric = async (data: IFace) => {
    try {
      const response = await RecognizeFaceBiometricAPI(data) as { data: ApiResponseWrapper };
      const resData = response.data.data;

      showNotification({
        path: '/api/v1/face/recognize',
        code: resData.code,
        message: resData.message || (resData.code === '0000' ? 'Recognition successful!' : 'Recognition failed'),
      });
    } catch (error: any) {
      showNotification({
        path: '/api/v1/face/recognize',
        code: 'SERVER_ERROR',
        message: error?.message || 'An error occurred during recognition.',
      });
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
          const input = document.getElementById('file-input-recognize');
          if (input) (input as HTMLInputElement).click();
        }}
      >
        {image ? (
          <div className="image-preview-container">
            <img src={image} alt="Uploaded" className="uploaded-image" />
            <button onClick={handleClearImage} className="clear-button">
              <MdClear size={24} />
            </button>
          </div>
        ) : (
          <div className="upload-icon">
            <MdCloudUpload size={50} />
            <p>Drag & drop an image here or click to upload</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
              id="file-input-recognize"
              style={{ display: 'none' }}
            />
          </div>
        )}
      </div>
      <div className="button-group">
        <button
          onClick={handleClearImage}
          className="clear-button-main"
          disabled={!faceData}
        >
          <MdClear size={20} />
          Clear Data
        </button>
        <button
          onClick={handleSubmit}
          className="submit-button"
          disabled={!faceData}
        >
          Submit Data
        </button>
      </div>
    </div>
  );
};

export default Recognize;
