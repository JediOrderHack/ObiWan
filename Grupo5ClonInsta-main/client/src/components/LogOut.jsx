import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOKEN_LOCAL_STORAGE_KEY } from '../utils/constants';

function LogOut() {
  const navigate = useNavigate();
  const [logoutMessage, setLogoutMessage] = useState('');

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY);
    setLogoutMessage('¡Sesión cerrada correctamente!');
    setTimeout(() => {
      setLogoutMessage('');
      navigate('/login');
      window.location.reload();
    }, 1500);
  };

  const buttonStyle = {
    backgroundColor: '#ffa9fa',
    padding: '10px 20px',
    border: '4px black solid',
    borderRadius: '15px',
    fontSize: '30px',
    color: 'black',
    cursor: 'pointer',
  };

  return (
    <div>
      {logoutMessage && (
        <div style={{ color: 'green', fontSize: '2rem', textAlign: 'center' }}>
          {logoutMessage}
        </div>
      )}
      <button onClick={handleLogout} style={buttonStyle}>
        Cerrar Sesión
      </button>
    </div>
  );
}

export default LogOut;
