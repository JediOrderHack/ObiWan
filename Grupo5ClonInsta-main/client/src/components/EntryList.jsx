import React, { useEffect, useState } from "react";
import axios from "axios";
import UserAvatar from "./UserAvatar";
import EntryLikes from "./EntryLikes";

const IMAGES_URL = "http://localhost:3000/uploads";

function EntryList() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/entries", {
          params: {
            search,
          },
          timeout: 15000,
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
  }, [search]);

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
          <UserAvatar userId={entry.userId} />
          <div>Nombre de Usuario: {entry.username}</div>
          <div>
            Fotos Subidas:
            {entry.photos &&
              entry.photos.map((photo, photoIndex) => (
                <img
                  key={`photo_${entry.id}_${photoIndex}`}
                  src={`${IMAGES_URL}/${photo.photoName}`}
                  alt={`Foto ${photoIndex + 1}`}
                />
              ))}
          </div>
          <div>Descripción: {entry.description}</div>
          <div>Likes: {entry.likesCount}</div>
          <EntryLikes
            entryId={entry.id}
            userId={entry.userId}
            likedByMe={entry.likedByMe}
          />
        </div>
      ))}
    </div>
  );
}

export default EntryList;

