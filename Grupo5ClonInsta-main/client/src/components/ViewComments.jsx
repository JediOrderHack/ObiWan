import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../utils/getToken';
const { VITE_API_URL } = import.meta.env;

const ViewComments = ({ comments, entryId }) => {
  const token = getToken();
  const [showAllComments, setShowAllComments] = useState(false);
  const maxCommentsToShow = 3;
  const [commentsArray, setCommentsArray] = useState([]);

  useEffect(() => {
    // Convierte la cadena de comentarios en un arreglo de objetos { id, author, text }
    const parsedComments = comments
      ? comments.split(',').map((comment, index) => {
          const [author, text] = comment.trim().split(': ');
          return { id: index + 2, author: author, text: text }; // Sumar 2 para ajustar los IDs según tu estructura de base de datos
        })
      : [];

    setCommentsArray(parsedComments);
  }, [comments]);

  const toggleComments = () => {
    setShowAllComments(!showAllComments);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${VITE_API_URL}/comments/${commentId}`, {
        headers: {
          Authorization: token,
        },
      });

      // Actualizar los comentarios después de eliminar el comentario
      const updatedComments = commentsArray.filter((comment) => comment.id !== commentId);
      setCommentsArray(updatedComments);
    } catch (error) {
      console.error('Error al eliminar el comentario', error);
    }
  };

  // Filtrar los comentarios a mostrar
  const displayedComments = showAllComments
    ? commentsArray
    : commentsArray.slice(0, maxCommentsToShow);

  return (
    <div>
      <h2>Comentarios</h2>
      {displayedComments.map((comment) => (
        <div key={comment.id}>
          <p>
            <strong>{comment.author}:</strong> {comment.text}
            <button onClick={() => handleDeleteComment(comment.id)}>Eliminar</button>
          </p>
        </div>
      ))}
      {showAllComments && (
        <button onClick={toggleComments}>Ver menos comentarios</button>
      )}
      {!showAllComments && commentsArray.length > maxCommentsToShow && (
        <button onClick={toggleComments}>Ver más comentarios</button>
      )}
    </div>
  );
};

export default ViewComments;
