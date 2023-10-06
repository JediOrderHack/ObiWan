// Importamos axios.
import axios from "axios";

// Importamos los hooks.
import { useState } from "react";

// Importamos la URL base de nuestra API.
const { VITE_API_URL } = import.meta.env;

// Importamos la función que retorna un token.
import { getToken } from "../../utils/getToken";

const AvatarForm = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    try {
      // Creamos un objeto formData para enviar la imagen.
      const formData = new FormData();

      // Agregamos la imagen al objeto formData.
      formData.append("avatar", file);

      // Obtenemos el token actual.
      const token = getToken();

      // Actualizamos el avatar.
      const response = await fetch(`${VITE_API_URL}/users/avatar`, {
        method: "PUT",
        headers: {
          Authorization: token, // Asegúrate de que 'token' sea válido
        },
        body: formData,
      })
       
      if (response.status === 200) {
        console.log("Subida de avatar a full");
      } else {
        // Maneja el error de acuerdo a tus necesidades.
        console.error("Error en la solicitud de Login:", response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir foto de perfil</button>
    </div>
  );
};

export default AvatarForm;
