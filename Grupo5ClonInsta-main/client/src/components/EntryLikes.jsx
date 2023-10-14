import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../utils/getToken";

function EntryLikes({ entryId, likesCount, updateLikesCount }) {
  const token = getToken();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/entries/${entryId}/likes`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        // El endpoint checkEntryLikeController devuelve un valor booleano
        setLiked(response.data.hasLiked);
      } catch (error) {
        console.error("Error al obtener el estado del like:", error);
      }
    };

    fetchData();
  }, [entryId, token]);

  const handleLikeClick = async () => {
    try {
      if (!liked) {
        // Envía una solicitud POST para dar like.
        await axios.post(
          `http://localhost:4000/entries/${entryId}/likes`,
          null,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setLiked(true);
        updateLikesCount(entryId, likesCount + 1); // Incrementa el contador
      } else {
        // Envía una solicitud DELETE para eliminar el like.
        await axios.delete(`http://localhost:4000/entries/${entryId}/likes`, {
          headers: {
            Authorization: token,
          },
        });
        setLiked(false);
        updateLikesCount(entryId, likesCount - 1); // Decrementa el contador
      }
    } catch (error) {
      console.error("Error al gestionar el like:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLikeClick}>{liked ? "Dislike" : "Like"}</button>
    </div>
  );
}

export default EntryLikes;
