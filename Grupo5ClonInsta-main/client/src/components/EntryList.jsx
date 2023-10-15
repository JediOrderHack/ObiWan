import React, { useEffect, useState } from "react";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import PublicProfileButton from "./PublicProfileButton";
import EntryLikes from "./EntryLikes";
import { Link, useParams } from "react-router-dom";
import { getToken } from "../utils/getToken";
import './EntryList.css'


const IMAGES_URL = "http://localhost:3000/uploads";

const imageStyles = {
  maxWidth: "80%",
  maxHeight: "60vh",
};

function EntryList() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const token = getToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Verifica si el token está presente antes de incluirlo en la solicitud.
        const headers = token;
        console.log(token)
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {};

        const response = await axios.get("http://localhost:3000/entries", {
          params: {
            search,
          },
          timeout: 15000,
          headers,
        });

        if (
          response.data.data.entries &&
          Array.isArray(response.data.data.entries)
        ) {
          setEntries(response.data.data.entries.reverse());
        } else {
          console.error(
            "La respuesta del servidor no contiene un array de entradas:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error al obtener las entradas:", error);
      }
    };

    fetchData();
  }, [search, token]);
  // Obtén la información del usuario desde el token (ajusta esto según la estructura de tu token).
  const userFromToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
  console.log(userFromToken)

  const updateLikesCount = (entryId, newCount) => {
    setEntries((prevEntries) => {
      return prevEntries.map((entry) => {
        if (entry.id === entryId) {
          return { ...entry, likesCount: newCount };
        }
        return entry;
      });
    });
  };

  return (
  <div className="entry-list-container">
    <input
      type="text"
      placeholder="Buscar entradas"
      className="search-input"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    {entries.map((entry, index) => (
      <div key={`entry_${entry.id}_${index}`} className="entry-container">
        <PublicProfileButton userId={entry.userId} />
        <div className="profile-link">@{entry.username}</div>
        <Carousel>
          {entry.photos &&
            entry.photos.map((photo, photoIndex) => (
              <div key={`photo_${entry.id}_${photoIndex}`}>
                <img
                  src={`${IMAGES_URL}/${photo.photoName}`}
                  alt={`Foto ${photoIndex + 1}`}
                  style={imageStyles}
                  className="entry-photo"
                />
              </div>
            ))}
        </Carousel>
        <div>Descripción: {entry.description}</div>
        <div>Likes: {entry.likesCount}</div>
        <EntryLikes
          entryId={entry.id}
          likesCount={entry.likesCount}
          updateLikesCount={updateLikesCount}
        />
        {entry.userId === userFromToken?.id && (
          <Link to={`/editEntry/${entry.id}`}>
            <button className="edit-button">Editar Entrada</button>
          </Link>
        )}
      </div>
    ))}
  </div>
);
        }
export default EntryList;
