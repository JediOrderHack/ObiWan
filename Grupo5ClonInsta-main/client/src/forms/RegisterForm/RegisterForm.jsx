import React, { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/users';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}`, {
        username,
        email,
        password,
      });

      if (response.status === 200) {
        console.log('Registro exitoso');
        setSuccessMessage('Revisa tu correo y entra en el enlace para activar tu cuenta.');
      } else {
        console.error('Error en la solicitud de registro:', response.data);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      {successMessage ? (
        <div className="success-message">{successMessage}</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>email:</label>
            <input
              type="email"
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
          <button type="submit">Registrarse</button>
        </form>
      )}
    </div>
  );
}

export default RegisterForm;