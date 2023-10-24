import React, { useState } from "react";
import axios from "axios";
import "../Auth.css";
import logo from "../../assets/logo-2.png";

const BASE_URL = "http://localhost:3000/users";

const successMessageStyle = {
  color: "green",
  fontSize: "1.5rem",
  marginTop: "1rem",
};

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}`, {
        username,
        email,
        password,
      });

      if (response.status === 200) {
        setErrorMessage(""); // Limpia el mensaje de error
        setSuccessMessage(
          "Usuario creado con éxito!! Revisa tu correo y entra en el enlace que te hemos enviado para activar tu cuenta en MEOW!"
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage(error.response.data.message);
        setSuccessMessage(""); // Limpia el mensaje de éxito si hay un error
      } else {
        setErrorMessage("Error al registrar. Por favor, inténtalo de nuevo más tarde.");
        setSuccessMessage(""); // Limpia el mensaje de éxito si hay un error
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
            {errorMessage && (
              <div style={{ color: "red", fontSize: "1.5rem", marginTop: "1rem" }}>
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div style={successMessageStyle}>{successMessage}</div>
            )}
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
