import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./EditEntryForm.css";
import { getToken } from "../../utils/getToken";

function EditEntryForm() {
  const { entryId } = useParams();
  const token = getToken();
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
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

        setDescription(entryDetails.description);
      } catch (error) {
        console.error("Error al obtener la descripción de la entrada:", error);
      }
    };

    fetchEntryDescription();
  }, [entryId, token]);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpdateDescription = async () => {
    try {
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

      setMessage("¡Entrada actualizada correctamente!¡Te llevo a ver tooodas las entradas!");

      setTimeout(() => {
        // Redirige al usuario a la página de inicio (/home) después de 4 segundos
        navigate("/home");
      }, 4000);
    } catch (error) {
      console.error("Error al actualizar la descripción de la entrada:", error);
      setMessage("Error al actualizar la entrada");
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
      <p style={{ color: message.includes("correctamente") ? "green" : "red" }}>
        {message}
      </p>
      <button className="btn-guardar" onClick={handleUpdateDescription}>
        Guardar Cambios
      </button>
    </div>
  );
}

export default EditEntryForm;
