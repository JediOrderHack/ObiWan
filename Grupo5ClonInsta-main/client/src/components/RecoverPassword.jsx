import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo-2.png"

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
    

<div className="app">

  <div className="auth_container reset_container">
    <h2 className="title title-2">Restablecer meowseña</h2>

    <div className="auth_box">
      <div className="input_box">
        <p>Escribe tu email</p>
        <input
          type="email"
          required
          onChange={handleEmailChange}
        />
      </div>
    </div>

    {email !== "" ? (
      <NavLink to="/update-password">
        <button>
          <img src={logo} alt="" />
        </button>
      </NavLink>
    ) : (
      <button>
        <img src={logo} alt="" />
      </button>
    )}
  </div>

<footer>Made with ♥️</footer>
</div>
  );
};

export default RecoverPassword;
