// Importamos los hooks.
import { useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/getToken";


// const BASE_URL = 'http://localhost:4000';

function AvatarForm(){
  const [avatar, setAvatar] = useState('');
  

  const handleUpload = async (e) => {
    const token = getToken();
    e.preventDefault()
    const file = e.target.files;
    const formData = new FormData();
    formData.append(avatar, file);
    console.log(token);
    try {
      const response = await axios.put("http://localhost:4000/users/avatar", formData, { 
        avatar,
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      }, });
      if (response.status === 200) {
        // Guardamos el token en el localStorage.
        console.log("SUBIDA AVATAR KFC SO GOOD");
      } else {
        // Maneja el error de acuerdo a tus necesidades.
        console.error('NO QUIERE SUBIR', response.data);
      }      } 
      catch (error) {
      setAvatar("Error: " + error.response.data.avatar);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" accept="image/*"  onChange={(e) => setAvatar(e.target.files)} required/>
      <button>Subir foto de perfil</button>
    </form>
  );
}

export default AvatarForm;
