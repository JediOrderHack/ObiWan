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
       
    
<div className="flex items-center justify-center h-full">
  <form className="max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700" onSubmit={handleSubmit}>   
    <div className="mb-4">
      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">Email</label>
      <input type="text" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={email}
              onChange={(e) => setEmail(e.target.value)}/>
    </div>
    <div className="mb-4">
      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">Password</label>
      <input className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="********" required=""/>
    </div>
    <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700" onSubmit={handleSubmit}>Registrarse</button>
       <a href="https://www.github.com" title="example button" className="py-2 px-8 rounded hover:bg-gray-800 hover:text-white text-white bg-gradient-to-r from-teal-600 to-blue-500">Example Button</a>
  </form>
</div>
    );
  }
  
  export default LoginForm;
