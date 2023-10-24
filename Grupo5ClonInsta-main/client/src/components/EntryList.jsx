import React, { useEffect, useState } from "react";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import PublicProfileButton from "./PublicProfileButton";
import EntryLikes from "./EntryLikes";
import { Link } from "react-router-dom";
import { getToken } from "../utils/getToken";
import './EntryList.css'

const UPLOADS_DIR = "http://localhost:3000/uploads";

const imageStyles = {
  maxWidth: "80%",
  maxHeight: "60vh",
};

function EntryList() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [noResults, setNoResults] = useState(false);
  const token = getToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = token
          ? {
              Authorization: token,
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
          setNoResults(response.data.data.entries.length === 0);
        } else {
          console.error(
            "La respuesta del servidor no contiene un array de entradas:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error al obtener las entradas:", error);
        setNoResults(true);
      }
    };

    fetchData();
  }, [search, token]);

  const userFromToken = token ? JSON.parse(atob(token.split(".")[1])) : null;

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
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      {noResults ? (
        <p className="no-results-message">No hay entradas que coincidan con lo buscado :(</p>
      ) : (
        entries.map((entry, index) => (
          <div key={`entry_${entry.id}_${index}`} className="entry-container">
            <div className="prfl">
              <PublicProfileButton userId={entry.userId} />
            </div>
            <div className="profile-link">@{entry.username}</div>
            {entry.photos && entry.photos.length > 0 && (
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
            )}
            <div className="profile-link">Descripción: {entry.description}</div>
            <div className="profile-link">Likes: {entry.likesCount}</div>
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
        ))
      )}
    </div>
  );
}

export default EntryList;
