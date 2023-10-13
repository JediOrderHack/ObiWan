import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

// Importa las constantes necesarias
import { TOKEN_LOCAL_STORAGE_KEY } from '../utils/constants';

function LogOut() {
  const navigate = useNavigate(); // Usa useNavigate para la redirección

  const handleLogout = () => {
    // Elimina el token de autenticación del localStorage
    localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY);

    navigate('/login'); 
     window.location.reload();
  };

  return (
    <div>
      
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}

export default LogOut;
