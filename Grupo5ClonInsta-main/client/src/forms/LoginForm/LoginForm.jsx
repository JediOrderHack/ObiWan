// Importamos axios.
import axios from 'axios';
//Importamos navigat.
import { useNavigate } from 'react-router-dom';
// Importamos los hooks.
import { useState } from 'react';

// Importamos el nombre con el que guardamos el token en el localStorage.
import { TOKEN_LOCAL_STORAGE_KEY } from '../../utils/constants'

// Importamos la URL base de nuestra API.
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
        // Guardamos el token en el localStorage.
        localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, response.data.data.token);
        console.log("Login exitoso");
        
        navigate("/home");
        
        window.location.reload();
      } else {
        // Maneja el error de acuerdo a tus necesidades.
        console.error('Error en la solicitud de Login:', response.data);
      }
    }catch (err) {
      console.error(err);
    }
  }
  
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>email:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" onSubmit={handleSubmit}>Log In</button>
        </form>

      {/* Agrega un enlace a la página de recuperación de contraseña */}
      <p>
        ¿Olvidaste tu contraseña? <a href="/forgot-password">Recupérala aquí</a>
      </p>
    </div>
    );
  }
  
  export default LoginForm;
