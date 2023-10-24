import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/getToken";
import './AvatarForm.css';
import addButton from '../../assets/add-icon.png'

const { VITE_API_URL } = import.meta.env;

const AvatarEditor = () => {
  const token = getToken();
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(''); // Nuevo estado para el mensaje

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

      setUpdateMessage('Avatar actualizado correctamente');

      // Limpia el mensaje después de 3 segundos
      setTimeout(() => {
        setUpdateMessage('');
        // Realiza la recarga después de que el mensaje se haya limpiado
        setTimeout(() => {
          window.location.reload();
        }, 1);
      }, 2000);

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
        {updateMessage && (
          <div className="update-message">
            {updateMessage}
          </div>
        )}
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
