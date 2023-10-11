import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/getToken';

const { VITE_API_URL } = import.meta.env;

const EntryLikes = ({ entry }) => {
  const [likeStatus, setLikeStatus] = useState(null);
  const [likesCount, setLikesCount] = useState(entry.likesCount);
  const userAuthToken = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserLiked = async () => {
      try {
        if (userAuthToken) {
          const response = await axios.get(
            `${VITE_API_URL}/entries/${entry.id}/likes/check`,
            {
              headers: {
                Authorization: userAuthToken,
              },
            }
          );

          if (response.data.status === 'ok') {
            setLikeStatus(response.data.hasLiked ? 'liked' : 'unliked');
          } else {
            console.error('Error al verificar like:', response.data);
          }
        }
      } catch (error) {
        console.error('Error al verificar like:', error);
      }
    };

    checkUserLiked();
  }, [userAuthToken, entry.id]);

  const handleLike = async () => {
    try {
      if (!userAuthToken) {
        // Si el usuario no está autenticado, redirige a la página de inicio de sesión
        navigate('/login');
        return;
      }

      if (likeStatus === 'liked') {
        // Si el usuario ya dio "like", realiza una solicitud para quitar el "like"
        const response = await axios.post(
          `${VITE_API_URL}/entries/${entry.id}/likes/remove`,
          {timeout: 10000,},
          {
            headers: {
              Authorization: userAuthToken || '',
            },
          }
        );

        if (response.data.status === 'ok') {
          setLikeStatus('unliked');
          setLikesCount(likesCount - 1);
        } else {
          console.error('Error al quitar like:', response.data);
        }
      } else {
        // Si el usuario no ha dado "like", realiza una solicitud para dar "like"
        const response = await axios.post(
          `${VITE_API_URL}/entries/${entry.id}/likes/add`,
          {},
          {
            headers: {
              Authorization: userAuthToken || '',
            },
          }
        );

        if (response.data.status === 'ok') {
          setLikeStatus('liked');
          setLikesCount(likesCount + 1);
        } else {
          console.error('Error al dar like:', response.data);
        }
      }
    } catch (error) {
      console.error('Error al dar/quitar like:', error);
    }
  };

  return (
    <div>
      <p>Likes: {likesCount}</p>
      <button onClick={handleLike}>
        {likeStatus === 'liked' ? 'Unlike' : 'Like'}
      </button>
    </div>
  );
};

export default EntryLikes;