import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/getToken.js";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import LogOut from "./LogOut.jsx";
const UPLOADS_DIR = "http://localhost:3000/uploads";

const PrivateProfileCard = () => {
  const [user, setUser] = useState(null);
  const token = getToken();
  const navigate = useNavigate(); // Inicializa la función navigate

  useEffect(() => {
    axios
      .get("http://localhost:3000/users", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setUser(response.data.data.user);
        console.log(response.data.data.user)
      })
      .catch((error) => {
        console.error("Error al obtener el perfil privado:", error);
        // Si hay un error, redirige al usuario a la página de inicio de sesión.
        navigate("/login");
      });
  }, [navigate, token]);

  return (
    <div className="private-profile-card">
      {user ? 
      (
        <div>
          <h2>Perfil Privado de {user.username}</h2>
          <p>Email: {user.email}</p>
          <img src={`${UPLOADS_DIR}/${user.avatar}`} alt="Avatar" /><br/>
          <button><LogOut/></button>
        </div>
      ) : (
        <p>Cargando perfil privado...</p>
      )}
    </div>
  );
};

export default PrivateProfileCard;
