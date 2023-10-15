import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TOKEN_LOCAL_STORAGE_KEY } from '../../utils/constants';
import "../Auth.css"
import { NavLink } from 'react-router-dom';
import logo from "../../assets/logo-2.png"
const { VITE_API_URL } = import.meta.env;


function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

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
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error en la solicitud de Login');
    }
  }

  return (
    <div className='app'>
      <div className="auth_container">
        <h2 className="title">LOGIN</h2>

        <div className="auth_box">
          <div className="input_box">
            <p>EMAIL</p>
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
            {error && <p style={{ color: 'red', fontSize: "2rem" }}>{error}</p>}
          </div>
        </div>
        <button onClick={handleSubmit}>
          <img src={logo} alt="" />
        </button>

        <NavLink to="/forgot-password">
          <button className="forget_btn">¿Has olvidado tu Meowseña?</button>
        </NavLink>
      </div>
    </div>
  );
}

export default LoginForm;
