import React, { useEffect, useState } from "react";
import axios from "axios";
import UserAvatar from "./UserAvatar";

// Rutas de las imágenes y los videos en tu servidor Express
const IMAGES_URL = "http://localhost:4000/images";

function EntryList() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // Realiza una solicitud GET al servidor para obtener las entradas
    axios
      .get("http://localhost:4000/entries")
      .then((response) => {
        // Verifica que response.entries sea un array antes de establecer el estado
        if (Array.isArray(response.data.entries)) {
          setEntries(response.data.entries);
        } else {
          console.error(
            "La respuesta del servidor no contiene un array de entradas:",
            response.data
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener las entradas:", error);
      });
  }, []);

  return (
    <div>
      {entries.map((entry) => (
        <div key={entry.id}>
          {/* Muestra la foto de avatar */}
          <img src={`${IMAGES_URL}/${entry.owner}.jpg`} alt={`${entry.owner}'s Avatar`} />

          {/* Muestra el nombre de usuario */}
          <div>Nombre de Usuario: {entry.owner}</div>

          {/* Muestra las fotos subidas */}
          <div>
            Fotos Subidas:
            {entry.photos.split(',').map((photoName) => (
              <img key={photoName} src={`${IMAGES_URL}/${photoName}`} alt={`Foto: ${photoName}`} />
            ))}
          </div>

          {/* Muestra el número de likes */}
          <div>Número de Likes: {entry.likesCount}</div>

          {/* Botón para dar/quitar like */}
          <button>Dar/Quitar Like</button>

          {/* Muestra la descripción */}
          <div>Descripción: {entry.description}</div>

          {/* Muestra los comentarios */}
          <div>Comentarios: {entry.comments}</div>
        </div>
      ))}
    </div>
  );
}

export default EntryList;
