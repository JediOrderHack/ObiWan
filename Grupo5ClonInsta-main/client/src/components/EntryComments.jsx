import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/getToken';
const { VITE_API_URL } = import.meta.env;

function EntryComment({ entryId, onCommentAdded }) {
  const token = getToken();
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCommentTextChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleAddComment = async () => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }

      if (commentText.length > 250) {
        setError('El comentario no puede tener más de 250 caracteres.');
        return;
      }

      const response = await fetch(`${VITE_API_URL}/entries/${entryId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
        body: JSON.stringify({ commentText }),
      });

      if (response.status === 200) {
        onCommentAdded();
        // Recarga la página después de agregar el comentario exitosamente
        window.location.reload();
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      setError('Hubo un error al agregar el comentario.');
    }
  };

  return (
    <div>
      <h2>Agregar Comentario</h2>
      {error && <div className="error">{error}</div>}
      <textarea
        placeholder="Escribe tu comentario aquí..."
        value={commentText}
        onChange={handleCommentTextChange}
      />
      <button onClick={handleAddComment}>Agregar Comentario</button>
    </div>
  );
}

export default EntryComment;
