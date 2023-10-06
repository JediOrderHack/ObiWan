import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/entries'; // Reemplaza con la URL correcta

function EntryList() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // Realiza la solicitud GET para obtener las entradas
    axios.get(API_URL)
      .then((response) => {
        if (response.status === 200) {
          setEntries(response.data.entries);
        } else {
          console.error('Error al obtener las entradas:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error al obtener las entradas:', error);
      });
  }, []);

  return (
    <div>
      <h2>Lista de Entradas</h2>
      {entries.map((entry) => (
        <div key={entry.id} className="entry">
          <div className="user-info">
            <p>Creado por: {entry.owner}</p>
          </div>
          <div className="photos">
            <div className="photo-scroll">
              {entry.photos.split(',').map((photo, index) => (
                <img
                  key={index}
                  src={C:\Users\isivi\Desktop\PROYECTO FINAL\Grupo5ClonInsta\BackInsta\images} 
                  alt={`Foto ${index}`}
                />
              ))}
            </div>
          </div>
          <div className="likes-comments">
            <p>Likes: {entry.likesCount}</p>
            {entry.comments ? (
              <div className="comments">
                {entry.comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <p>{comment.user}: {comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Sin comentarios</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default EntryList;