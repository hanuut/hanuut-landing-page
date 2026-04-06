import React, { useState, useRef } from "react";
import styled from "styled-components";
import { FaUpload, FaTrash } from "react-icons/fa";

const UploaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const PreviewCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #fafafa;
  border: 2px dashed #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .icon {
    color: #ccc;
    font-size: 2rem;
  }
`;

const UploadButton = styled.button`
  background: none;
  border: none;
  color: #39a170;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
`;

// --- THIS IS THE FIX: The 'Label' component was missing from this file ---
export const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 700;
  color: #333;
  display: block;
  margin-bottom: 0.5rem;
`;

const ImageUploader = ({ onFileSelect }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    }
  };

  return (
    <UploaderWrapper>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg"
        style={{ display: "none" }}
      />
      <PreviewCircle onClick={() => fileInputRef.current.click()}>
        {preview ? (
          <img src={preview} alt="Logo Preview" />
        ) : (
          <FaUpload className="icon" />
        )}
      </PreviewCircle>
      <div>
        <Label>Shop Logo (Optional)</Label>
        <UploadButton
          type="button"
          onClick={() => fileInputRef.current.click()}
        >
          Upload Image
        </UploadButton>
      </div>
    </UploaderWrapper>
  );
};

export default ImageUploader;
