import { getToken } from "../../utils/getToken";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './ProfileButton.css'
const UPLOADS_DIR = "http://localhost:3000/uploads";

const ProfileButton = () => {
  const [user, setUser] = useState(null);
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/users/", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setUser(response.data.data.user);
        console.log(response.data.data.user);
      })
      .catch((error) => {
        console.error("Usuario no registrado");
      });
  }, []);

  const handleProfileClick = () => {
    if (token) {
      navigate("/perfil");
    } else {
      navigate("/login");
    }
  };

  return (
  <div className="profile-button">
    {token ? (
      user ? (
        user.avatar ? (
          <Link to="/perfil">
            <div>
              <img
                className="avtr"
                src={`${UPLOADS_DIR}/${user.avatar}`}
                alt="Avatar"
              />
              <p className="usrnm">@{user.username}</p>
            </div>
          </Link>
        ) : (
          // Si el usuario no tiene avatar, muestra una imagen por defecto
          <Link to="/perfil">
            <div>
              <img
                className="avtr"
                src={`${UPLOADS_DIR}/DefaultAvatar.png`}
                alt="Avatar por defecto"
              />
              <p className="usrnm">@{user.username}</p>
            </div>
          </Link>
        )
      ) : (
        <p>Cargando...</p> // Agrega un mensaje de carga o maneja este caso de manera diferente según tus necesidades
      )
    ) : (
      <Link to="/perfil">
        <div>
          <img
            className="avtr"
            src={`${UPLOADS_DIR}/DefaultAvatar.png`}
            alt= "Avatar por defecto"
          />
        </div>
      </Link>
    )}
  </div>
);
};

export default ProfileButton;
