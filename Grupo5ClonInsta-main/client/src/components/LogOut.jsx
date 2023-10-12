import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

// Importa las constantes necesarias
import { TOKEN_LOCAL_STORAGE_KEY } from '../utils/constants';

function LogOut() {
  const navigate = useNavigate(); // Usa useNavigate para la redirección

  const handleLogout = () => {
    // Elimina el token de autenticación del localStorage
    localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY);

    // Redirige al usuario a la página de inicio de sesión o a la página que desees
    navigate('/login'); // Cambia '/login' por la ruta adecuada
     window.location.reload();
  };

  return (
    <div>
      <h2>Logout</h2>
      <p>¿Estás seguro de que deseas cerrar sesión?</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}

export default LogOut;
