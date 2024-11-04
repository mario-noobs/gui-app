// // src/components/ImageUpload.js

// import React, { useState } from 'react';

// const ImageUpload = () => {
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [message, setMessage] = useState('');

//     const handleImageChange = (event) => {
//         setSelectedImage(event.target.files[0]);
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();
        
//         if (!selectedImage) {
//             setMessage('Please select an image to upload.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('image', selectedImage);

//         try {
//             const response = await fetch('https://your-server-url.com/upload', {
//                 method: 'POST',
//                 body: formData,
//             });

//             setMessage(response.ok ? 'Image uploaded successfully!' : 'Image upload failed.');
//         } catch (error) {
//             setMessage(`An error occurred: ${error.message}`);
//         }
//     };

//     return (
//         <div style={styles.container}>
//             <h2>Upload Image</h2>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     required
//                     style={styles.input}
//                 />
//                 <button type="submit" style={styles.button}>Upload</button>
//             </form>
//             {message && <p style={styles.message}>{message}</p>}
//         </div>
//     );
// };

// const styles = {
//     container: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '100vh',
//         backgroundColor: '#f0f0f0',
//         padding: '20px',
//         borderRadius: '8px',
//         boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//     },
//     input: {
//         margin: '10px 0',
//     },
//     button: {
//         padding: '10px 20px',
//         backgroundColor: '#4CAF50',
//         color: 'white',
//         border: 'none',
//         borderRadius: '5px',
//         cursor: 'pointer',
//     },
//     message: {
//         marginTop: '10px',
//     },
// };

// export default ImageUpload;
