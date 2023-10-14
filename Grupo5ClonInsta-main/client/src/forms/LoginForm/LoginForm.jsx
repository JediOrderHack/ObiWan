import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TOKEN_LOCAL_STORAGE_KEY } from '../../utils/constants';
import "../Auth.css"
import { NavLink } from 'react-router-dom';
const { VITE_API_URL } = import.meta.env;
import logo from "../../assets/logo-2.png"
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${VITE_API_URL}/users/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, response.data.data.token);
        console.log("Login exitoso");
        navigate("/home");
        window.location.reload();
      } else {
        console.error('Error en la solicitud de Login:', response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className='app'>
      
      <div className="auth_container">
          <h2 className="title">Regístrate</h2>

          <div className="auth_box">
            <div className="input_box">
              <p>Usuario</p>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input_box">
              <p>Contraseña</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button onClick={handleSubmit}>
            <img src={logo} alt="" />
          </button>

          <NavLink to="/forgot-password">
            <button className="forget_btn">¿Has olvidado tu Meowseña?</button>
          </NavLink>
        </div>

      <footer>Made with ♥️</footer>
      </div>
  );
}

export default LoginForm;
