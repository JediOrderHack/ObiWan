import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getToken } from "../utils/getToken.js";


const SERVER_URL = "http://localhost:3000/entries";
const IMAGES_URL = "http://localhost:3000/images";

function EditEntryPage() {
  
  const { id } = useParams()
  const token = getToken();
  const [entryData, setEntryData] = useState({
    description: "",
    photos: [],
    videos: [],
  });

  const [photoIds, setPhotoIds] = useState([]); // Almacenar los IDs de las fotos
  const [tempPhotos, setTempPhotos] = useState([]);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/${id}`)
      .then((response) => {
        setEntryData(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de la entrada:", error);
      });

    // Realizar una solicitud GET para obtener los IDs de las fotos
    axios
      .get(`${SERVER_URL}/photos`)
      .then((response) => {
        setPhotoIds(response.data); // Almacena los IDs de las fotos en el estado
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los IDs de las fotos:", error);
      });
  }, [id]);
console.log(photoIds)
const getPhotoId = (photoName) => {
  if (photoIds.photos) {
    
    const photo = photoIds.photos.find(
      (photo) => photo.photoName === photoName
    );
    return photo?.id || null;
  } else {
    // Devuelve null si la lista de IDs de fotos no está definida.
    return null;
  }
};


  const handleDescriptionChange = (event) => {
    setEntryData({
      ...entryData,
      description: event.target.value,
    });
  };

  const handlePhotoAdd = (event) => {
    const selectedFile = event.target.files[0]; // Accede al archivo seleccionado

    if (selectedFile) {
      setTempPhotos([...tempPhotos, selectedFile]);
    }
  };

const handlePhotoDelete = (photoId) => {
  if (photoId === null) {
    console.error("El ID de la foto es null.");
    return;
  }

  const token = getToken();
  const formData = new FormData();
  formData.append("photoId", photoId);

  fetch(`${SERVER_URL}/${id}/photos/${photoId}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
    body: formData,
  })
    .then((response) => {
      if (response.status === 200) {
        console.log("Foto eliminada con éxito");
        // Eliminar la foto del estado de la entrada
        const updatedPhotos = entryData.photos.filter(
          (photo) => photo.id !== photoId
        );
        setEntryData({
          ...entryData,
          photos: updatedPhotos,
        });
      } else {
        // Maneja el error de acuerdo a tus necesidades.
        console.error("Error al eliminar la foto:", response);
      }
    })
    .catch((error) => {
      console.error("Error al eliminar la foto:", error);
    });
};

  const handleVideoAdd = (newVideo) => {
    setEntryData({
      ...entryData,
      videos: [...entryData.videos, newVideo],
    });
  };

  const handleVideoDelete = (videoIndex) => {
    const updatedVideos = [...entryData.videos];
    updatedVideos.splice(videoIndex, 1);
    setEntryData({
      ...entryData,
      videos: updatedVideos,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // Primero, actualiza la descripción
      await axios.put(
        `${SERVER_URL}/${id}`, // URL de la descripción
        { description: entryData.description }, // Datos de la descripción
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // Luego, sube las fotos si existen fotos temporales
      if (tempPhotos.length > 0) {
        const formData = new FormData();
        tempPhotos.forEach((selectedFile) => {
          formData.append("photo", selectedFile);
        });

        const response = await axios.post(
          `${SERVER_URL}/${id}/photos`,
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Limpia el estado de fotos temporales
        setTempPhotos([]);

        // Actualiza la lista de fotos después de agregar las nuevas fotos
        const updatedPhotoIds = response.data;
        setPhotoIds(updatedPhotoIds);
      }

      // Redirige a la página de entrada después de guardar los cambios
      window.location.href = `/entries`;
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  return (
    <div>
      <h1>Editar Entrada</h1>
      <div>
        <p>Miniaturas de fotos existentes:</p>
        {typeof entryData.photos === "string" &&
          entryData.photos.split(",").map(
            (photoName, index) => (
              console.log(photoName),
              console.log(entryData.photos),
              (
                <div key={index}>
                  <img
                    src={`${IMAGES_URL}/${photoName}`}
                    alt={`Foto: ${photoName}`}
                  />
                  <button
                    onClick={() => {
                      const photoId = getPhotoId(entryData.photos[index]?.id);
                      if (photoId) {
                        handlePhotoDelete(photoId);
                      }
                    }} // Pasa el id de la foto
                    style={{ cursor: "pointer", marginLeft: "10px" }}
                    disabled={!photoId} // Deshabilita el botón si el ID de la foto es `undefined`.
                  >
                    x
                  </button>
                </div>
              )
            )
          )}
      </div>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Descripción:</label>
          <input
            type="text"
            value={entryData.description}
            onChange={handleDescriptionChange}
          />
        </div>
        <div>
          <label>Fotos:</label>
          {Array.isArray(tempPhotos) &&
            tempPhotos.map((photo, index) => (
              <div key={index}>
                <img src={URL.createObjectURL(photo)} alt={`Foto ${index}`} />
                <button onClick={() => handlePhotoDelete(index)}>
                  Eliminar
                </button>
              </div>
            ))}
          <div>
            <input type="file" onChange={handlePhotoAdd} />
          </div>
        </div>
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
}

export default EditEntryPage;
