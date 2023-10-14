import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TOKEN_LOCAL_STORAGE_KEY } from '../../utils/constants';
import "../Auth.css"

const { VITE_API_URL } = import.meta.env;

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
    
      <div className="auth_container">
        <h2 className="title">Login</h2>
        <div className='auth-box'>
        <form onSubmit={handleSubmit}>
          <div className="input_box">
            <label>email:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input_box">
            <label>password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" onSubmit={handleSubmit}>Log In</button>
        </form>
        </div>
        <p>
          ¿Olvidaste tu contraseña? <a href="/forgot-password">Recupérala aquí</a>
        </p>
      </div>
  );
}

export default LoginForm;
