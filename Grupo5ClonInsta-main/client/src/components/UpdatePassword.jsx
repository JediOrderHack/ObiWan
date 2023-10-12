import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const [recoveryPassCode, setRecoveryPassCode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Obtiene la función de navegación

  const handleRecoveryPassCodeChange = (e) => {
    setRecoveryPassCode(e.target.value);
  };

  const handleNewPassChange = (e) => {
    setNewPass(e.target.value);
  };

  const handleUpdatePassword = async () => {
    try {
      const response = await axios.put("http://localhost:4000/users/reset-password", {
        recoveryPassCode,
        newPass,
      });
      setMessage(response.data.message);

      // Si la contraseña se actualiza correctamente, redirige al usuario a la página de inicio de sesión (/login)
      if (response.data.status === "ok") {
        navigate("/login");
      }
    } catch (error) {
      setMessage("Error: " + error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Escribe tu nueva Meowseña</h2>
      <label>Escribe el PIN recibido en tu email</label>
      <input
        type="text"
        placeholder="Código de recuperación"
        value={recoveryPassCode}
        onChange={handleRecoveryPassCodeChange}
      />
      <label>Nueva Meowtraseña</label>
      <input
        type="password"
        placeholder="Nueva contraseña"
        value={newPass}
        onChange={handleNewPassChange}
      />
      <button onClick={handleUpdatePassword}>MeOw</button>
      <p>{message}</p>
    </div>
  );
};

export default UpdatePassword;