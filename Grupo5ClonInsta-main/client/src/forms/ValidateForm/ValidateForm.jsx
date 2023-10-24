import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ValidateForm = () => {
  const { regCode } = useParams();
  const navigate = useNavigate();

  const [activated, setActivated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const activateAccount = async () => {
      try {
        // Realiza la solicitud PUT al servidor para activar la cuenta
        const response = await fetch(`http://localhost:3000/users/validate/${regCode}`, {
          method: "PUT",
        });

        if (response.ok) {
          // La cuenta se activó con éxito
          // Mostrar el mensaje de éxito durante 8 segundos
          setTimeout(() => {
            setActivated(true);
            // Redirige al usuario a la página de inicio de sesión (/login) después de 4 segundos
            setTimeout(() => navigate("/login"), 8000);
          }, 5000);
        } else {
          // Manejar errores, por ejemplo, mostrar un mensaje de error
          setErrorMessage("Error al activar la cuenta");
        }
      } catch (error) {
        console.error("Error al enviar la solicitud", error);
        setErrorMessage("Error al enviar la solicitud");
      }
    };

    activateAccount();
  }, [regCode, navigate]);

  const messageContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  const successMessageStyle = {
    backgroundColor: "green",
    color: "white",
    padding: "1rem",
    borderRadius: "5px",
    fontSize: "1.5rem",
  };

  const errorMessageStyle = {
    backgroundColor: "red",
    color: "white",
    padding: "1rem",
    borderRadius: "5px",
    fontSize: "1.5rem",
  };

  return (
    <div style={messageContainerStyle}>
      {activated ? (
        <div style={successMessageStyle}>
          <p>
            Tu cuenta ha sido activada con éxito. Serás redirigido a la página de inicio
            de sesión en un momento.
          </p>
        </div>
      ) : (
        <div style={errorMessageStyle}>
          <p>{errorMessage || "Activando tu cuenta..."}</p>
        </div>
      )}
    </div>
  );
};

export default ValidateForm;
