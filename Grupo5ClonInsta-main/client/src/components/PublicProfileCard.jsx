import React, { useEffect, useState } from "react";
import axios from "axios";
import UserAvatar from "./UserAvatar";
import { useParams } from "react-router-dom";
import Profile from "./Profile/Profile";

const UPLOADS_DIR = "http://localhost:3000/uploads";

const PublicProfileCard = () => {
  const {userId}= useParams()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    // Verificar si userId es nulo antes de hacer la solicitud GET
    if (userId) {
      axios
        .get(`http://localhost:3000/users/${userId}`)
        .then((response) => {
          
          setUserData(response.data.data);
          console.log(response.data.data)
        })
        .catch((error) => {
          console.error("Error al obtener el perfil público:", error);
          // Manejar el error aquí, por ejemplo, redirigir a una página de error.
        });
    }
  }, [userId]);

  return (
    <div className="container">
      {userData && (
        <div>
          <Profile
            avatar ={userData.user.avatar}
            username ={userData.user.username}
            entries={userData.user.entries}
           >
          </Profile>         
        </div>
      )}
    </div>
  );
};

export default PublicProfileCard;
