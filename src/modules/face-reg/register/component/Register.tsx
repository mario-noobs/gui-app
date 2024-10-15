import React, { useState } from 'react';
import { MdCloudUpload } from 'react-icons/md';
import '../../styles/UploadStyles.css'; // Make sure to create this CSS file

const Register = () => {
  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    // Call your API here with the image
    console.log('Submitting image:', image);
  };

  return (
    <div className="upload-container">
      <h2>Register</h2>
      <div
        className="image-drop-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()} // Click to open file picker
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
