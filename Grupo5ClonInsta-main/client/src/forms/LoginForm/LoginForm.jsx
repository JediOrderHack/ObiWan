// Importamos axios.
import axios from 'axios';

// Importamos los hooks.
import { useState } from 'react';

// Importamos el nombre con el que guardamos el token en el localStorage.
import { TOKEN_LOCAL_STORAGE_KEY } from '../../utils/constants'

// Importamos la URL base de nuestra API.
const { VITE_API_URL } = import.meta.env;

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      } else {
        // Maneja el error de acuerdo a tus necesidades.
        console.error('Error en la solicitud de Login:', response.data);
      }
    }catch (err) {
      console.error(err);
    }
  }
  
    return (
       
    <div class="flex items-center justify-center h-screen w-screen bg-gray-900">
    <form class="bg-white shadow-md rounded px-8 py-8 pt-8" onSubmit={handleSubmit}>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="" type="text" placeholder="John" type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"    type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="********"/>
        </div>
        <div class="flex flex-col items-center justify-center">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" onSubmit={handleSubmit}>
                Sign In
            </button>
            <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/forgot-password">Forgot Password?</a>
        </div>
    </form>
</div>
    );
  }
  
  export default LoginForm;
