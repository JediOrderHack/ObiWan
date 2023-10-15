
const { VITE_API_URL } = import.meta.env;

import React, { useState, useEffect } from "react";
import axios from "axios"; // Asegúrate de tener axios instalado en tu proyecto
import { getToken } from "../../utils/getToken";
import './AvatarForm.css'
import addButton from '../../assets/add-icon.png'


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

      // Refrescar la página después de actualizar el avatar
      window.location.reload();

      // Limpiar el estado después de subir la imagen
      setAvatar(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error al subir el avatar:", error);
      // Manejar errores según tus necesidades
    }
  };

return (
  <div className="">
    <h2 className="title">Editar Avatar</h2>
    <div className="edit_profile_container">
      <div className="avatar">
        {previewUrl && <img src={previewUrl} alt="Avatar Preview" />}
      </div>
      <p className="edit-avatar-label">Editar foto de perfil</p>
      {avatar && (
        <button
          className="edit-avatar-button"
          onClick={handleAvatarUpload}
        ><img src={addButton} alt="" /></button>
      )}
      <label className="label-input">
        ELEGIR NUEVA FOTO
      <input
        className="avatar-input"
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
      />
    </label>
    </div>
  </div>
);

};

export default AvatarEditor;

