import React, { useEffect, useState } from "react";
import axios from "axios";
import UserAvatar from "./UserAvatar";
import EntryLikes from "./EntryLikes";
import EntryComment from "./EntryComments";
import { getToken } from "../utils/getToken";
import ViewComments from "./ViewComments";

const IMAGES_URL = "http://localhost:4000/images";

function SearchEntries() {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const userAuthToken = getToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/entries", {
          timeout: 10000,
        });

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

    fetchData(); // Llama a fetchData() cuando se monta el componente
  }, []);

  const handleCommentAdded = (entryId) => {
    // Puedes agregar aquí la lógica que deseas después de que se agrega un comentario
    // Por ejemplo, puedes actualizar la lista de comentarios o hacer cualquier otra acción necesaria.
    console.log(`Comentario agregado para la entrada con ID: ${entryId}`);
  };

  useEffect(() => {
    const filteredResults = entries.filter((entry) =>
      entry.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (userSearchTerm) {
      // Si se proporciona un término de búsqueda de usuario, filtra también por usuario
      const userFilteredResults = filteredResults.filter((entry) =>
        entry.owner.toLowerCase().includes(userSearchTerm.toLowerCase())
      );
      setFilteredEntries(userFilteredResults);
    } else {
      setFilteredEntries(filteredResults);
    }
  }, [entries, searchTerm, userSearchTerm]);

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Buscar por descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Buscar por usuario..."
          value={userSearchTerm}
          onChange={(e) => setUserSearchTerm(e.target.value)}
        />
      </div>
      {filteredEntries.length === 0 ? (
        <p>No se encontraron entradas.</p>
      ) : (
        filteredEntries.map((entry, index) => (
          <div key={`entry_${entry.id}_${index}`}>
            <UserAvatar userId={entry.userId} />
            <div>Nombre de Usuario: {entry.owner}</div>
            <div>
              Fotos Subidas:
              {entry.photos &&
                JSON.parse(entry.photos).map((photoUrl, photoIndex) => (
                  <img
                    key={`photo_${entry.id}_${photoIndex}`}
                    src={`${IMAGES_URL}/${photoUrl}`}
                    alt={`Foto ${photoIndex + 1}`}
                  />
                ))}
            </div>
            <EntryLikes key={entry.id} entry={entry} />
            <div>Descripción: {entry.description}</div>
            <ViewComments comments={entry.comments} />
            <EntryComment
              entryId={entry.id}
              onCommentAdded={() => handleCommentAdded(entry.id)}
            />
          </div>
        ))
      )}
    </div>
  );
}

export default SearchEntries;
