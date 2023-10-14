import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ValidateForm = () => {
  const { regCode } = useParams();
  const navigate = useNavigate();

  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const activateAccount = async () => {
      try {
        // Realiza la solicitud PUT al servidor para activar la cuenta
        const response = await fetch(
          `http://localhost:3000/users/validate/${regCode}`,
          {
            method: "PUT",
          }
        );

        if (response.ok) {
          // La cuenta se activó con éxito
          // Mostrar "Activando tu cuenta" durante 2 segundos
          setTimeout(() => {
            setActivated(true);
            // Redirige al usuario a la página de inicio de sesión (/login) después de 2 segundos
            setTimeout(() => navigate("/login"), 2000);
          }, 2000);
        } else {
          // Manejar errores, por ejemplo, mostrar un mensaje de error
          console.error("Error al activar la cuenta");
        }
      } catch (error) {
        console.error("Error al enviar la solicitud", error);
      }
    };

    activateAccount();
  }, [regCode, navigate]);

  return (
    <div>
      {activated ? (
        <p>
          Tu cuenta ha sido activada con éxito, te llevaré a la página de inicio
          de sesión.
        </p>
      ) : (
        <div>
          <p>Activando tu cuenta...</p>
        </div>
      )}
    </div>
  );
};

export default ValidateForm;
