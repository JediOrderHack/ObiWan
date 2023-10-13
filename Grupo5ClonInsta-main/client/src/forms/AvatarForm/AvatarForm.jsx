
const { VITE_API_URL } = import.meta.env;

import React, { useState, useEffect } from "react";
import axios from "axios"; // Asegúrate de tener axios instalado en tu proyecto
import { getToken } from "../../utils/getToken";

const AvatarEditor = () => {
  const token= getToken()
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    setAvatar(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatar);

      // Hacer una solicitud para enviar el avatar al servidor
      await axios.put(`${VITE_API_URL}/users/avatar`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      // Actualizar el avatar del usuario en el frontend si es necesario
      // ...
      
      // Limpiar el estado después de subir la imagen
      setAvatar(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error al subir el avatar:", error);
      // Manejar errores según tus necesidades
    }
  };

  return (
    <div>
      <h2>Editar Avatar</h2>
      {previewUrl && <img src={previewUrl} alt="Avatar Preview" />}
      <input type="file" accept="image/*" onChange={handleAvatarChange} />
      {avatar && <button onClick={handleAvatarUpload}>Guardar Avatar</button>}
    </div>
  );
}

export default AvatarEditor;

