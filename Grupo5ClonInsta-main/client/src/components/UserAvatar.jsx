import { useEffect, useState } from "react";
import axios from "axios";

const IMAGES_URL = "http://localhost:3000/images";

function UserAvatar({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Realiza una solicitud GET al servidor para obtener la información del usuario por su ID
    console.log(userId)
    axios
      .get(`http://localhost:3000/users/${userId}`)
      .then((response) => {
       
        // Verifica si la respuesta contiene información del usuario
        if (response.data && response.data.user) {
          setUser(response.data.user);
        
        } else {
          console.error(
            "La respuesta del servidor no contiene información del usuario:",
            response.data
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener la información del usuario:", error);
      });
  }, [userId]);

  if (!user) {
    return null; // Puedes mostrar un estado de carga mientras se obtiene la información del usuario
  }

  return (
    <div className="user-avatar">
      <img src={`${IMAGES_URL}/${user.avatar}`} alt={user.name} />
      {/* <button onClick={onChatOpen}>Abrir Chat</button> */}
    </div>
  );
}

export default UserAvatar;
