import React, { useState } from "react";
import axios from "axios";
import "../Auth.css"
import { NavLink } from 'react-router-dom';
const BASE_URL = "http://localhost:4000/users";
import logo from "../../assets/logo-2.png"


function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      } else {
        console.error("Error en la solicitud de registro:", response.data);
      }
    } catch (error) {
      console.error("Error al registrar:", error);
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
            {successMessage && (
              <div className="error-message">{successMessage}</div>
            )}
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
          </div>
        </div>

        <button onClick={handleSubmit}>
          Deja tu huella en <img src={logo} alt="" />
        </button>
      </div>
    <footer>Made with ♥️</footer>
  </div>
  );
}

export default RegisterForm;
