import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/getToken.js";
import { useNavigate } from "react-router-dom";
import LogOut from "./LogOut.jsx";
import AvatarEditor from "../forms/AvatarForm/AvatarForm.jsx";
import './PrivateProfileCard.css'
const UPLOADS_DIR = "http://localhost:3000/uploads";

const PrivateProfileCard = () => {
  const [user, setUser] = useState(null);
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/users", {
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
        navigate("/login");
      });
  }, [navigate, token]);

  const goToAvatarEditor = () => {
    navigate("/avatar");
  };

  return (
    <div className="private-profile-card" style={{ marginTop: "80px", textAlign: "center" }}>
      {user ? (
        <div>
          <h2>@{user.username}</h2>
          <p>{user.email}</p>
          <img className="avtr" src={`${UPLOADS_DIR}/${user.avatar}`} alt="Avatar" />
          <br />
          <AvatarEditor />
          
          <div>
            <LogOut />
          </div>
        </div>
      ) : (
        <p>Cargando perfil privado...</p>
      )}
    </div>
  );
};

export default PrivateProfileCard;
