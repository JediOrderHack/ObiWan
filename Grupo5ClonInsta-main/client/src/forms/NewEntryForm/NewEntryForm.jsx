import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/getToken";
import { useNavigate } from "react-router-dom";
import "./NewEntryForm.css";

const { VITE_API_URL } = import.meta.env;

const NewEntryForm = () => {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 3);
    if (files.length + selectedFiles.length > 3) {
      alert("Solo puedes seleccionar un máximo de 3 imágenes.");
    } else {
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const removeImage = (index) => {
    const updatedFiles = [...files];
    const updatedPreviews = [...imagePreviews];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Debes seleccionar al menos una imagen antes de subir la entrada.");
      return;
    }

    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`photo${index + 1}`, file);
      });
      formData.append("description", description);

      const token = getToken();

      if (token) {
        const response = await axios.post(`${VITE_API_URL}/entries`, formData, {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        });

        const responseData = response.data;

        if (responseData.status === "ok") {
          setSuccessMessage("¡Entrada publicada con éxito! ¡Te llevo a verla, dame un momento!");
          setTimeout(() => {
            navigate(`/home`);
          }, 3000);
        } else {
          console.error("Error al crear la entrada:", responseData.data);
        }
      } else {
        navigate(`/login`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="new-entry-form">
      <h2>Nueva Entrada</h2>
      <div className="file-input-container">
        <label className="file-label">Selecciona tus imágenes, ¡puedes subir hasta tres!:</label>
        <input
          className="file-input"
          type="file"
          accept="image/jpg"
          multiple
          onChange={handleFileChange}
          ref={inputRef}
          required
        />
        <button
          className="file-upload-button"
          onClick={() => {
            inputRef.current.click();
          }}
        >
          Examinar
        </button>
      </div>
      <div className="image-preview-container">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="image-preview">
            <div className="image-preview-wrapper">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
              <button
                onClick={() => removeImage(index)}
                className="remove-button"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="description-container">
        <label className="description-label">Descripción:</label>
        <textarea
          className="description-input"
          rows="4"
          cols="50"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      {successMessage && (
        <p className="success-message">{successMessage}</p>
      )}
      <button className="upload-button" onClick={handleUpload}>
        Crear Entrada
      </button>
    </div>
  );
};

export default NewEntryForm;
