import React, { useEffect, useState } from "react";
import axios from "axios";
import UserAvatar from "./UserAvatar";
import { useParams } from "react-router-dom";
import EntryLikes from "./EntryLikes";
import { Carousel } from "react-responsive-carousel";
import "./EntryList.css"
import PublicProfileButton from "./PublicProfileButton";


const UPLOADS_DIR = "http://localhost:3000/uploads";

const PublicProfileCard = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3000/users/${userId}`)
        .then((response) => {
          setUserData(response.data.data);
        })
        .catch((error) => {
          console.error("Error al obtener el perfil público:", error);
        });
    }
  }, [userId]);

  const updateLikesCount = (entryId, newLikesCount) => {
    // Actualiza el contador de likes en userData
    setUserData((prevUserData) => {
      const updatedUserData = { ...prevUserData };
      updatedUserData.user.entries = updatedUserData.user.entries.map((entry) => {
        if (entry.id === entryId) {
          return { ...entry, likesCount: newLikesCount };
        }
        return entry;
      });
      return updatedUserData;
    });
  };

  return (
    <div className="entry-list-container">
      {userData && (
        <div>
          <img
            key={`avatar`}
            src={`${UPLOADS_DIR}/${userData.user.avatar}`}
            alt={`avatar`}
          />
          <div>@{userData.user.username}</div>
          {userData.user.entries.map((entry, index) => (
            <div className="entry-container" key={`entry_${entry.id}_${index}`}>
              <div className="prfl">
            <PublicProfileButton userId={entry.userId} />
            </div>
              <div>
                <Carousel>
                {entry.photos &&
                  entry.photos.map((photo, photoIndex) => (
                    <img
                      key={`photo_${entry.id}_${photoIndex}`}
                      src={`${UPLOADS_DIR}/${photo.photoName}`}
                      alt={`Foto ${photoIndex + 1}`}
                      className="entry-photo"

                    />
                  ))}
                  </Carousel>
              </div>
              <div>Descripción: {entry.description}</div>

              <div>Likes: {entry.likesCount}</div>
              <EntryLikes
                entryId={entry.id}
                likesCount={entry.likesCount}
                updateLikesCount={updateLikesCount}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicProfileCard;

