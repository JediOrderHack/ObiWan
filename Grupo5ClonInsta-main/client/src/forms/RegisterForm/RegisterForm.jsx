import React, { useState } from "react";
import axios from "axios";
import "../Auth.css";
import { NavLink } from 'react-router-dom';
const BASE_URL = "http://localhost:3000/users";
import logo from "../../assets/logo-2.png";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false); // Nuevo estado para rastrear el registro exitoso
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Nuevo estado para manejar el mensaje de error

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}`, {
        username,
        email,
        password,
      });

      if (response.status === 200) {
        console.log("Registro exitoso");
        setSuccessMessage(
          "Revisa tu correo y entra en el enlace para activar tu cuenta."
        );
        setErrorMessage(""); // Limpia el mensaje de error si hubo uno previamente
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Usuario o email ya registrados.");
      } else {
        setErrorMessage("Error al registrar. Por favor, inténtalo de nuevo más tarde.");
      }
    }
  };

  return (
    <div className="app">
      <div className="auth_container">
        <h2 className="title">Regístrate</h2>

        <div className="auth_box">
          <div className="input_box">
            <p>Usuario</p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <div className="input_box">
            <p>Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Muestra el mensaje de error */}
          </div>
        </div>

        <button onClick={handleSubmit}>
          Deja tu huella en <img src={logo} alt="" />
        </button>
      </div>
    </div>
  );
}

export default RegisterForm;
