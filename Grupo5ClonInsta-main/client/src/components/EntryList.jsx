import React, { useEffect, useState } from "react";
import axios from "axios";
import UserAvatar from "./UserAvatar";
import EditButton from "./EditButton";


const IMAGES_URL = "http://localhost:3000/images";
const VITE_API_URL = "http://localhost:3000"; // Asegúrate de tener la URL correcta para tus solicitudes
const getLoggedInUserId = () => {
  // Devuelve el ID del usuario logueado, o null si no hay ningún usuario logueado.
};
function EntryList() {
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setLoggedInUserId(getLoggedInUserId());

    const fetchEntries = async () => {
      try {
        const response = await axios.get(`${VITE_API_URL}/entries`);

        if (Array.isArray(response.data.entries)) {
          setEntries(response.data.entries);
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

    fetchEntries();
  }, []);
console.log(entries)
  return (
    <div>
      {entries.map((entry) => (
        <div key={entry.id}>
          <UserAvatar userId={entry.userId} />
          <div>Nombre de Usuario: {entry.owner}</div>
          <div>
            Fotos Subidas:
            {entry.photos &&
              entry.photos
                .split(",")
                .map((photoName) => (
                  <img
                    key={photoName}
                    src={`${IMAGES_URL}/${photoName}`}
                    alt={`Foto: ${photoName}`}
                  />
                ))}
          </div>
          <div>Número de Likes: {entry.likesCount}</div>
          {/* Botón para dar/quitar like */}
          <button>Dar/Quitar Like</button>

          {/* Botón para editar entrada */}
          
            <EditButton entryId={entry.id} />
          

          <div>Descripción: {entry.description}</div>
          <div>Comentarios: {entry.comments}</div>
        </div>
      ))}
    </div>
  );
}

export default EntryList