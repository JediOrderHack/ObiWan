import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TOKEN_LOCAL_STORAGE_KEY } from '../utils/constants';

function LogOut() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY);
    navigate('/login');
    window.location.reload();
  };

  const buttonStyle = {
    backgroundColor: '#ffa9fa', 
    padding: '10px 20px', 
    border: 'none',
    borderRadius: '15px',
    fontSize: '30px', 
    color: '#fff',
    cursor: 'pointer',
  };


  return (
    <div>
      <button onClick={handleLogout} style={buttonStyle} onMouseOver={() => Object.assign(buttonStyle)}>
        Cerrar Sesión
      </button>
    </div>
  );
}

export default LogOut;

