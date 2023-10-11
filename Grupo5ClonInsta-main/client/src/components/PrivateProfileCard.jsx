import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/getToken.js";
const UPLOADS_DIR = 'http://localhost:3000/images'



const PrivateProfileCard = () => {
  const [user, setUser] = useState(null);   
  const token = getToken()
  useEffect(() => {
    // Realizar la solicitud a tu servidor para obtener el perfil privado del usuario.
    // Asegúrate de usar la ruta adecuada definida en tu servidor.

    axios
      .get("http://localhost:3000/users", {
        headers:{
            Authorization:token
        }
      })
      .then((response) => {
        setUser(response.data.data.user);
        
      })
      .catch((error) => {
        console.error("Error al obtener el perfil privado:", error);
      });
  }, []);

  return (
    <div className="private-profile-card">
      {user ? (
        <div>
          <h2>Perfil Privado de {user.username}</h2>
          <p>Email: {user.email}</p>
          <img src={ `${UPLOADS_DIR}/${user.avatar}`} alt="Avatar" />
        </div>
      ) : (
        <p>Cargando perfil privado...</p>
      )}
    </div>
  );
};

export default PrivateProfileCard;
