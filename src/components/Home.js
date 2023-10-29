import * as filestack from 'filestack-js';
import React, { useState } from 'react';
import axios from 'axios'; // Import the axios library

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile);
      const client = filestack.init("ASOcJeKFZS1m5rYyTVyFFz");
      client.upload(selectedFile).then(data => {
        const urlFile = data.url;
        console.log('Uploaded:', urlFile);
        axios.post(
          'http://localhost:8000/files/',
          { 
            url: urlFile
          }
          )
          .then(response => {
            console.log('Processed file link is:', response.data);
          })
          .catch(error => {
            console.error('Error sending file link to the backend:', error);
          });
      });
    } else {
      console.log('No file selected.');
    }
  };

  return (
    <div style={{ "marginInlineStart": "200px" }}>
      <h1>Bienvenido, aquí puedes subir un archivo para categorizar los textos!</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {selectedFile && <p>Selected File: {selectedFile.name}</p>}
    </div>
  );
}

export default Home;
