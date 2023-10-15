import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo-2.png"

const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleRecoverPassword = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3000/users/recover-password",
        { email }
      );

      if (response.data.status === "error" && response.data.message === "Usuario no encontrado") {
        // Si el email no existe, muestra un mensaje de error
        setMessage("Email no válido");
      } else {
        // Si el email existe, redirige al usuario a la página /update-password
        navigate("/update-password");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage("Error: " + error.response.data.message);
      } else {
        setMessage("Error desconocido");
      }
    }
  };

  return (
    <div className="app">
      <div className="auth_container reset_container">
        <h2 className="title title-2">Restablecer contraseña</h2>
        <div className="auth_box">
          <div className="input_box">
            <p>Escribe tu email</p>
            <input type="email" required onChange={handleEmailChange} />
          </div>
          {message && <p className="error-message">Email no válido</p>}
        </div>
        <button onClick={handleRecoverPassword}>
          <img src={logo} alt="" />
        </button>
      </div>
    </div>
  );
};

export default RecoverPassword;

