import * as filestack from 'filestack-js';
import React, { useState } from 'react';
import axios from 'axios'; // Import the axios library
import '../styles/Home.css';

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [processedFileUrl, setProcessedFileUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleDownload = () => { // 3. Función para manejar la descarga
    if (processedFileUrl) {
      window.open(processedFileUrl.message, '_blank');
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      setUploading(true);
      const client = filestack.init("ASOcJeKFZS1m5rYyTVyFFz");
      client.upload(selectedFile).then(data => {
        const urlFile = data.url;
        axios.post('http://localhost:8000/files/', { url: urlFile })
          .then(response => {
            setUploading(false);
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
            }, 3000);
            console.log('Processed file link is:', response.data);
            setProcessedFileUrl(response.data); 
            const enlaceHTML = `<a href="${response.data.url}">Enlace</a>`;
            console.log('Link is:', processedFileUrl)
            console.log('Enlace HTML:', enlaceHTML)
          })
          .catch(error => {
            setUploading(false);
            console.error('Error sending file link to the backend:', error);
          });
      });
    } else {
      console.log('No file selected.');
    }
  };

  return (
    <div className="container">
      <h1 style={{ backgroundColor: '#f9f9f9', padding: '10px' }}>Bienvenido, aquí puedes subir un archivo para categorizar los textos!</h1>
      
      <input type="file" onChange={handleFileChange} />
      {selectedFile && <p>Selected File: {selectedFile.name}</p>}
      <hr />
      <button onClick={handleUpload}>{uploading ? 'Cargando...' : 'Upload'}</button>
      {success && <div className="success-popup">¡Carga exitosa!</div>}
      <hr></hr>
      {processedFileUrl && <button onClick={handleDownload}>Download Processed File</button>}
    </div>
  );
}

export default Home;
