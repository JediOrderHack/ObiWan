import { NavLink, useNavigate } from 'react-router-dom';
import ProfileButton from '../ProfileButton/ProfileButton';
import homeIcon from "../../assets/home-icon.png";
import addIcon from "../../assets/add-icon.png";
import logo from "../../assets/logo.png";
import './NavBar.css';

function NavBar() {
  // Verificar si el authToken está presente en el localStorage
  const isLoggedIn = localStorage.getItem('authToken') !== null;
  const navigate = useNavigate();

  const handleNewEntryClick = () => {
    if (isLoggedIn) {
      // Si está registrado, navegar a la ruta /newEntry
      navigate('/newEntry');
    } else {
      // Si no está registrado, navegar a la ruta /login
      navigate('/login');
    }
  };

  return (
    <div className="navigation_container">
      <div className="navigation_left">
        <NavLink to="/home"><img src={homeIcon} alt="inicio" /></NavLink>
        <div onClick={handleNewEntryClick}>
          <img src={addIcon} alt="añadir foto" />
        </div>
      </div>
      <div className="center-logo">
        <img src={logo} alt="logo" />
      </div>
      <div className="auth_btns">
        <div className="profile-button-container">
          <ProfileButton/>
        </div>
        {isLoggedIn ? null : ( 
          <div className="auth-buttons">
            <NavLink to="/login">Login</NavLink>
            
            <NavLink to="/register">Register</NavLink>
          </div>
         )} 
      </div>
    </div>
  );
}

export default NavBar;
