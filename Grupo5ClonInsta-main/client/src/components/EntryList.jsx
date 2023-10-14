import React, { useEffect, useState } from "react";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importar estilos del carrusel
import { Carousel } from "react-responsive-carousel";
import UserAvatar from "./UserAvatar";
import PublicProfileButton from "./PublicProfileButton";
import EntryLikes from "./EntryLikes";
import { Link, useParams } from "react-router-dom";
import { getToken } from "../utils/getToken";



const IMAGES_URL = "http://localhost:3000/uploads";

const imageStyles = {
  maxWidth: "80%", // Establece un ancho máximo del 80% del contenedor
  maxHeight: "60vh", // Establece una altura máxima del 60% del viewport height
};

function EntryList() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
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

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar entradas"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {entries.map((entry, index) => (
        <div key={`entry_${entry.id}_${index}`}>
          <PublicProfileButton userId={entry.userId} />
          <div>Nombre de Usuario: {entry.username}</div>
          <Carousel>
            {entry.photos &&
              entry.photos.map((photo, photoIndex) => (
                <div key={`photo_${entry.id}_${photoIndex}`}>
                  <img
                    src={`${IMAGES_URL}/${photo.photoName}`}
                    alt={`Foto ${photoIndex + 1}`}
                    style={imageStyles}
                  />
                </div>
              ))}
          </Carousel>
          <div>Descripción: {entry.description}</div>
          <div>Likes: {entry.likesCount}</div>
          <EntryLikes
            entryId={entry.id}
            userId={entry.userId}
            likedByMe={entry.likedByMe}
          />
          {entry.userId === userFromToken?.id && (
            <Link to={`/editEntry/${entry.id}`}>
              <button>Editar Entrada</button>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

export default EntryList;
