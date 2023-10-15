import { getToken } from "../utils/getToken";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './PublicProfileButton.css'
const UPLOADS_DIR = "http://localhost:3000/uploads";

const PublicProfileButton = ({ userId }) => {
  const [user, setUser] = useState(null);
  const token = getToken();

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3000/users/${userId}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setUser(response.data.data.user);
          console.log(response.data.data.user);
        })
        .catch((error) => {
          console.error("Error al obtener el perfil privado:", error);
        });
    }
  }, [userId, token]);

  return (
    <div className="avatar-button">
      {user && user.avatar ? (
        <Link to={`/perfil-publico/${userId}`}>
          <img src={`${UPLOADS_DIR}/${user.avatar}`} alt="Avatar" />
        </Link>
      ) : (
        <Link to={`/perfil-publico/${userId}`}>
          <img
            src={`${UPLOADS_DIR}/DefaultAvatar.png`}
            alt="Avatar por defecto"
          />
        </Link>
      )}
    </div>
  );
};

export default PublicProfileButton;
