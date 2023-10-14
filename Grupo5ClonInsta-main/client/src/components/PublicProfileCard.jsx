import React, { useEffect, useState } from "react";
import axios from "axios";
import UserAvatar from "./UserAvatar";
import { useParams } from "react-router-dom";

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
    <div>
      {userData && (
        <div>
          <img
            key={`avatar`}
            src={`${UPLOADS_DIR}/${userData.user.avatar}`}
            alt={`avatar`}
          />
          <div>Nombre de Usuario: {userData.user.username}</div>
          {userData.user.entries.map((entry, index) => (
            <div key={`entry_${entry.id}_${index}`}>
              <div>Descripción: {entry.description}</div>
              <div>
                Fotos Subidas:
                {entry.photos &&
                  entry.photos.map((photo, photoIndex) => (
                    <img
                      key={`photo_${entry.id}_${photoIndex}`}
                      src={`${UPLOADS_DIR}/${photo.photoName}`}
                      alt={`Foto ${photoIndex + 1}`}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicProfileCard;