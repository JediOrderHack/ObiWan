import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ValidateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Obtén la función de navegación

  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const activateAccount = async () => {
      try {
        // Realiza la solicitud POST al servidor para activar la cuenta
        const response = await fetch(`http://localhost:3000/users/validate/${id}`, {
          method: 'POST',
        });

        if (response.ok) {
          // La cuenta se activó con éxito
          setActivated(1);

          // Redirige al usuario a la página de inicio de sesión (/login)
          navigate('/login');
        } else {
          // Manejar errores, por ejemplo, mostrar un mensaje de error
          console.error('Error al activar la cuenta');
        }
      } catch (error) {
        console.error('Error al enviar la solicitud', error);
      }
    };

    activateAccount();
  }, [id, navigate]);

  return (
    <div>
      {activated ? (
        <p>Tu cuenta ha sido activada con éxito.</p>
      ) : (
        <div>
          <p>Activando tu cuenta...</p>
        </div>
      )}
    </div>
  );
};

export default ValidateForm;

