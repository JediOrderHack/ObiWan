import React, { useEffect, useState } from "react";
import axios from "axios";
import UserAvatar from "./UserAvatar";
import { useParams } from "react-router-dom";
import EntryLikes from "./EntryLikes";
import { Carousel } from "react-responsive-carousel";
import "./EntryList.css"
import PublicProfileButton from "./PublicProfileButton";


const UPLOADS_DIR = "http://localhost:3000/uploads";
const imageStyles = {
  maxWidth: "80%",
  maxHeight: "60vh",
};

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
        <div className="entry-list-container">
          <div className="dynamo">
          <img
            key={`avatar`}
            src={`${UPLOADS_DIR}/${userData.user.avatar}`}
            alt={`avatar`}
          />
          </div>
          <div className="dynamo">@{userData.user.username}</div>
          
          {userData.user.entries.map((entry, index) => (
            <div className="entry-container" key={`entry_${entry.id}_${index}`}>
              <div className="prfl">
            <PublicProfileButton userId={entry.userId} />
            </div>
              <div>
            <Carousel showThumbs={false} showStatus={false}>
              {entry.photos.map((photo, photoIndex) => (
                <div key={`photo_${entry.id}_${photoIndex}`}>
                  <img
                    src={`${UPLOADS_DIR}/${photo.photoName}`}
                    alt={`Foto ${photoIndex + 1}`}
                    style={imageStyles}
                    className="entry-photo"
                  />
                </div>
              ))}
            </Carousel>
              </div>
          <div className="profile-link">Descripción: {entry.description}</div>
          <div className="profile-link">Likes:{entry.likesCount}</div>

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

