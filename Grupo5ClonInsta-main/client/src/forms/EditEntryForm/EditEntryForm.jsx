import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom"; // Importa 'navigate' de '@reach/router'.
import "./EditEntryForm.css";
import { getToken } from "../../utils/getToken";

function EditEntryForm() {
  const { entryId } = useParams();
  const token = getToken();
  const [description, setDescription] = useState("");

  useEffect(() => {
    // Obtén la descripción actual de la entrada desde el servidor.
    const fetchEntryDescription = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/entries/${entryId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const entryDetails = response.data.data.entry;
        console.log(response.data.data.entry);

        setDescription(entryDetails.description);
      } catch (error) {
        console.error("Error al obtener la descripción de la entrada:", error);
      }
    };

    fetchEntryDescription();
  }, [entryId]);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpdateDescription = async () => {
    try {
      // Envía una solicitud al servidor para actualizar la descripción de la entrada.
      await axios.put(
        `http://localhost:3000/entries/${entryId}`,
        {
          description: description,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(token);

      // Utiliza 'Navigate' para redirigir al usuario a la lista de entradas después de la actualización.
     return <Link to="/home" />; // Cambio a Navigate dentro del JSX
    } catch (error) {
      console.error("Error al actualizar la descripción de la entrada:", error);
    }
  };

  return (
    <div className="edit-form-container">
      <h2 className="edit-form-top">Editar Descripción de la Entrada</h2>
      <label className="lbl-newdesc">Nueva Descripción:</label>
      <input
        type="text"
        value={description}
        onChange={handleDescriptionChange}
      />
      {/* Utiliza <Link> para redirigir al usuario a la página de inicio */}
      <Link to="/home">
        <button className="btn-guardar" onClick={handleUpdateDescription}>Guardar Cambios</button>
      </Link>
    </div>
  );
}

export default EditEntryForm;
