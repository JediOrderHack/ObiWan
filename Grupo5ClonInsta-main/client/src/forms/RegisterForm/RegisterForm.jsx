import React, { useState } from "react";
import axios from "axios";
import "./RegisterForm.css";

const BASE_URL = "http://localhost:4000/users";

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
    <div className="post_container">
      <div className="post_top">
        {successMessage ? (
          <div className="success-message">{successMessage}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username:</label>
              <br></br>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <br></br>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <br></br>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <button type="submit">Registrarse</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default RegisterForm;
