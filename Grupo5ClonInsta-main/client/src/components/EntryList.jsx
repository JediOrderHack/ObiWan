import React, { useEffect, useState } from "react";
import axios from "axios";
import UserAvatar from "./UserAvatar";
import EntryLikes from "./EntryLikes";
import EntryComment from "./EntryComments";
import { getToken } from "../utils/getToken";
import ViewComments from "./ViewComments";

const IMAGES_URL = "http://localhost:4000/images";

function EntryList({ entriesProp }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const userAuthToken = getToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/entries", {
          timeout: 15000,
        });

        if (response.data.entries && Array.isArray(response.data.entries)) {
          setEntries(response.data.entries.reverse());
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

<<<<<<< HEAD
    fetchEntries();
=======
    fetchData(); // Llama a fetchData() cuando se monta el componente
>>>>>>> ae8c2c5777a562afc21e728b4dd27489415f6945
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

<<<<<<< HEAD
          {/* Botón para editar entrada */}
          
            <EditButton entryId={entry.id} />
          

          <div>Descripción: {entry.description}</div>
          <div>Comentarios: {entry.comments}</div>
=======
  const handleCommentAdded = (entryId) => {
    // Puedes agregar aquí la lógica que deseas después de que se agrega un comentario
    // Por ejemplo, puedes actualizar la lista de comentarios o hacer cualquier otra acción necesaria.
    console.log(`Comentario agregado para la entrada con ID: ${entryId}`);
  };

  return (
    <div>
      {entries.map((entry, index) => (
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
          <ViewComments comments={entry.comments} entryId={entry.id}/>
          <EntryComment
            entryId={entry.id}
            onCommentAdded={() => handleCommentAdded(entry.id)}
          />
>>>>>>> ae8c2c5777a562afc21e728b4dd27489415f6945
        </div>
      ))}
    </div>
  );
}

<<<<<<< HEAD
export default EntryList
=======
export default EntryList;


>>>>>>> ae8c2c5777a562afc21e728b4dd27489415f6945
