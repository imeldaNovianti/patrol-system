import React, { useState } from 'react';
import { uploadFile } from '../services/api';

export default function FileUpload({ type, reportId, itemId, onUploaded, existingFile, uploadedBy }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(existingFile || null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const upload = async () => {
    if (!file) return;
    
    setUploading(true);
    try {
      const result = await uploadFile(file, type, reportId, itemId, uploadedBy);
      if (result.success) {
        onUploaded(result.filepath);
        alert('File uploaded successfully');
      } else {
        alert('Upload failed: ' + result.message);
      }
    } catch {
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      {preview && (
        <div className="preview">
          <img 
            src={preview.startsWith('data:') ? preview : `http://localhost:8000/${preview}`} 
            alt={`${type} preview`} 
            style={{ maxWidth: '200px', maxHeight: '200px' }} 
          />
        </div>
      )}
      <div className="upload-controls">
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button 
          type="button" 
          onClick={upload} 
          disabled={!file || uploading}
        >
          {uploading ? 'Uploading...' : `Upload ${type}`}
        </button>
      </div>
    </div>
  );
}