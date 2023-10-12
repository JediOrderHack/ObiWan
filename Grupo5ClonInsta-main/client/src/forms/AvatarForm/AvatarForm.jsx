// Importamos los hooks.
import { useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/getToken";



const BASE_URL = 'http://localhost:4000';

function AvatarForm(){
  const token = getToken();

// Datos que deseas enviar en la solicitud PUT (por ejemplo, la imagen del avatar)
const [avatar, setAvatar] = useState('');


// Realiza la solicitud PUT usando Axios
const handleUpload = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(`${BASE_URL}/avatar`, avatar, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      }
    })

    if (response.status === 200) {
      
      console.log("Subida avatar exitosa");
    } else {
      // Maneja el error de acuerdo a tus necesidades.
      console.error('Error en la subida del avatar', response.data);
    }
  }catch (err) {
    console.error(err);
  }
}

  return (
    <form onSubmit={handleUpload}>
      <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])} required/>
      <button>Subir foto de perfil</button>
    </form>
  );
}

export default AvatarForm;
