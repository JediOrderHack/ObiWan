import { getToken } from "../utils/getToken";
import { useState,useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const UPLOADS_DIR = "http://localhost:3000/images";


const ProfileButton = () => {

  const [user, setUser] = useState(null);
  const token = getToken();
   

  useEffect(() => {
    axios
      .get("http://localhost:3000/users/", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setUser(response.data.data.user);
        console.log(response.data.user)
      })
      .catch((error) => {
        console.error("Error al obtener el perfil privado:", error);
         });
         }, []);
         console.log(user)
  return (
    <div className="profile-button">
      {token ? (
        user && user.avatar ? (
          <Link to="/perfil">
            <img src={`${UPLOADS_DIR}/${user.avatar}`} alt="Avatar" />
          </Link>
        ) : (
          // Si el usuario no tiene avatar, muestra una imagen por defecto
          <Link to="/perfil">
            <img
              src={`${UPLOADS_DIR}/DefaultAvatar.png`}
              alt="Avatar por defecto"
            />
          </Link>
        )
      ) : (
        // Si el usuario no está autenticado, muestra una imagen por defecto y enlace a la página de inicio de sesión
        <Link to="/login">
          <img
            src={`${UPLOADS_DIR}/DefaultAvatar.png`}
            alt="Avatar por defecto"
          />
        </Link>
      )}
    </div>
  );
};

export default ProfileButton;
