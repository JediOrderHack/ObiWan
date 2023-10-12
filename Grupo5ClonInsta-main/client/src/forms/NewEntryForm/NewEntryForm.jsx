import React, { useState, useRef } from "react";
import axios from "axios";
import { getToken } from "../../utils/getToken";
import { useNavigate } from "react-router-dom";

const { VITE_API_URL } = import.meta.env;

const NewEntryForm = () => {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]); // Estado para almacenar las vistas previas
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 3);
    if (files.length + selectedFiles.length > 3) {
      alert("Solo puedes seleccionar un máximo de 3 imágenes.");
    } else {
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

      // Mostrar vista previa de todas las imágenes seleccionadas
      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`photo${index + 1}`, file);
      });
      formData.append("description", description);

      const token = getToken();

      const response = await axios.post(`${VITE_API_URL}/entries`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      const responseData = response.data;

      if (responseData.status === "ok") {
        console.log("Entrada creada con éxito");
        const entryData = responseData.data.entry;
        navigate(`/home`);
      } else {
        console.error("Error al crear la entrada:", responseData.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Nueva Entrada</h2>
      <div>
        <label>Imagen:</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          ref={inputRef}
          style={{ display: "none" }}
        />
        <button
          onClick={() => {
            inputRef.current.click();
          }}
        >
          Examinar
        </button>
      </div>
      {imagePreviews.map((preview, index) => (
        <img key={index} src={preview} alt={`Preview ${index + 1}`} width="100" height="100" />
      ))}
      <div>
        <label>Descripción:</label>
        <textarea
          rows="4"
          cols="50"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      <button onClick={handleUpload}>Crear Entrada</button>
    </div>
  );
};

export default NewEntryForm;
