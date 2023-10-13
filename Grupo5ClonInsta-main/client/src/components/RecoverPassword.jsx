import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Obtiene la función de navegación

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleRecoverPassword = async () => {
    try {
      const response = await axios.put(
        "http://localhost:4000/users/recover-password",
        { email }
      );
      setMessage(response.data.message);

      // Redirige al usuario a la página /update-password
      navigate("/update-password");
    } catch (error) {
      setMessage("Error: " + error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Reestablecer Meowseña</h2>
      <label> Escribe tu email </label>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={handleEmailChange}
      />
      <button onClick={handleRecoverPassword}>MeOw</button>
      <p>{message}</p>
    </div>
  );
};

export default RecoverPassword;
