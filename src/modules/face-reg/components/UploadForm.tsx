import React, { useRef } from 'react';

interface UploadFormProps {
  image: string | null;
  loading: boolean;
  onImageChange: (image: string | null, base64: string | null) => void;
  buttonText?: string;
  disabled?: boolean;
}

const UploadForm: React.FC<UploadFormProps> = ({
  image,
  loading,
  onImageChange,
  buttonText = 'Drag & drop or click to upload your face image',
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          onImageChange(reader.result, base64String);
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
          onImageChange(reader.result, base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    onImageChange(null, null);
  };

  return (
    <div
      className="upload-container"
      style={{
        maxWidth: 420,
        width: '100%',
        minWidth: 320,
        minHeight: 340,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className={`image-drop-area ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled && fileInputRef.current) fileInputRef.current.click();
        }}
        style={{
          width: 380,
          height: 260,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px dashed #a78bfa',
          borderRadius: '16px',
          background: '#f8fafc',
          cursor: disabled ? 'not-allowed' : 'pointer',
          position: 'relative',
          transition: 'border 0.2s',
        }}
      >
        {image ? (
          <div className="image-preview-container" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <img
              src={image}
              alt="Uploaded"
              className="uploaded-image"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px' }}
            />
            <button
              onClick={handleClearImage}
              className="clear-button"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
              title="Clear image"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="upload-icon" style={{ textAlign: 'center', padding: '20px', color: '#a78bfa' }}>
            <span style={{ fontSize: 48 }}>☁️</span>
            <p style={{ color: '#64748b', marginTop: '10px' }}>{buttonText}</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
              ref={fileInputRef}
              style={{ display: 'none' }}
              disabled={disabled}
            />
          </div>
        )}
        {loading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '16px',
            zIndex: 2
          }}>
            <span className="loader" style={{ color: '#a78bfa', fontWeight: 600 }}>Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
