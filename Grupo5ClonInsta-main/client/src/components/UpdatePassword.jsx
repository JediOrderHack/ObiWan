import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-2.png";
import "../forms/Auth.css";

const UpdatePassword = () => {
  const [recoveryPassCode, setRecoveryPassCode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRecoveryPassCodeChange = (e) => {
    setRecoveryPassCode(e.target.value);
  };

  const handleNewPassChange = (e) => {
    setNewPass(e.target.value);
  };

  const handleUpdatePassword = async () => {
    try {
      const response = await axios.put("http://localhost:3000/users/reset-password", {
        recoveryPassCode,
        newPass,
      });

      // Si la contraseña se actualiza correctamente
      if (response.data.status === "ok") {
        setMessage("Contraseña actualizada correctamente! En breves te llevamos a la página de login!");
        // Redirige al usuario a la página de inicio de sesión (/login) después de 8 segundos
        setTimeout(() => navigate("/login"), 8000);
      } else {
        // Si el código introducido es inválido
        setMessage("¡Código incorrecto!");
      }
    } catch (error) {
      setMessage("Error: " + error.response.data.message);
    }
  };

  return (
    <div className="app">
      <div className="auth_container">
        <h2 className="title title-2">Escribe tu nueva contraseña:</h2>

        <div className="auth_box">
          <div className="input_box input_box-2">
            <p>Escribe el PIN recibido en tu email</p>
            <input
              type="text"
              placeholder="Código de recuperación"
              value={recoveryPassCode}
              onChange={handleRecoveryPassCodeChange}
            />
          </div>
          <div className="input_box input_box-2">
            <p>Nueva contraseña</p>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPass}
              onChange={handleNewPassChange}
            />
          </div>
            <p style={{ color: message.includes("correctamente") ? "green" : "red" }}>{message}</p>

        </div>

        <button onClick={handleUpdatePassword}>
          <img src={logo} alt="" />
        </button>
      </div>
    </div>
  );
};

export default UpdatePassword;
