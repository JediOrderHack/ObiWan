import React, { useState } from 'react';
import axios from 'axios';
const { VITE_API_URL } = import.meta.env;
import { getToken } from '../utils/getToken';

function EntryLikes({ entryId, userId, likedByMe }) {
  console.log(likedByMe)
  const [liked, setLiked] = useState(likedByMe);

  const handleLike = async () => {
    try {
      const token = getToken(); // Obtén el token de autorización (depende de tu implementación)
      const response = await axios.post(`${VITE_API_URL}/entries/${entryId}/likes`, null, {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.status === 'ok') {
        setLiked(true);
      }
    } catch (error) {
      console.error('Error al dar me gusta', error);
    }
  };

  const handleUnlike = async () => {
    try {
      const token = getToken();
      const response = await axios.delete(`${VITE_API_URL}/entries/${entryId}/likes`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.status === 'ok') {
        setLiked(false);
      }
    } catch (error) {
      console.error('Error al quitar el me gusta', error);
    }
  };

  return (
    <div>
      <button onClick={liked ? handleUnlike : handleLike}>
        {liked ? 'Quitar Me Gusta' : 'Me Gusta'}
      </button>
    </div>
  );
}

export default EntryLikes;
