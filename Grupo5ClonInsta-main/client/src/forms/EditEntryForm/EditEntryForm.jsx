import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/getToken";
import { useNavigate, useParams } from "react-router-dom";

const { VITE_API_URL } = import.meta.env;

const EditEntryForm = () => {
  const { entryId } = useParams(); // Obtén el ID de la entrada de los parámetros de la URL
  const [entry, setEntry] = useState(null);
  const [description, setDescription] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Carga la entrada existente cuando el componente se monta
    const fetchEntry = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`${VITE_API_URL}/entries/${entryId}`, {
          headers: {
            Authorization: token,
          },
        });

        const responseData = response.data;
        if (responseData.status === "ok") {
          setEntry(responseData.data);
          setDescription(responseData.data.description);
        } else {
          console.error("Error al obtener la entrada:", responseData.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchEntry();
  }, [entryId]);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpdate = async () => {
    try {
      const token = getToken();
      const response = await axios.put(
        `${VITE_API_URL}/entries/${entryId}`,
        {
          description: description,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const responseData = response.data;

      if (responseData.status === "ok") {
        console.log("Entrada actualizada con éxito");
        navigate("/home");
      } else {
        console.error("Error al actualizar la entrada:", responseData.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Editar Entrada</h2>
      {entry && (
        <div>
          <label>Imagen:</label>
          {/* Aquí puedes mostrar la imagen actual si es necesario */}
        </div>
      )}
      <div>
        <label>Descripción:</label>
        <textarea
          rows="4"
          cols="50"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      <button onClick={handleUpdate}>Actualizar Entrada</button>
    </div>
  );
};

export default EditEntryForm;
