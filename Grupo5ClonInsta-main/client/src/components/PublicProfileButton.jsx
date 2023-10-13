import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import { getToken } from "../utils/getToken";
import axios from "axios";

const PublicProfileButton = ({ userId }) => {
  const token = getToken();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3000/users/${userId}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setUserProfile(response.data.data.userId);
        })
        .catch((error) => {
          console.error("Error al obtener el perfil privado:", error);
        });
    }
  }, [userId, token]);

  return (
    <Link to={`/perfil-publico/${userId}`}>
      <button>
        {userProfile ? <UserAvatar userId={userProfile} /> : "Cargando..."}
      </button>
    </Link>
  );
};

export default PublicProfileButton;
