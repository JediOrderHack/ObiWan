import React, { useState } from "react";

const EditEntryForm = ({ entry, onEdit }) => {
  const [description, setDescription] = useState(entry.description);
  const [photos, setPhotos] = useState([...entry.photos]);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    const newPhotos = Array.from (e.target.files);
    setPhotos([...photos, ...newPhotos]);
  };

  const handleRemoveImage = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const handleEdit = async () => {
    try {
      // Create a FormData object to send the images
      const formData = new FormData();
      formData.append("description", description);
      photos.forEach((photo) => {
        formData.append("images", photo);
      });

      // Send a PUT request to the edit entry endpoint
      const response = await fetch(`http://localhost:3000/entries/${entry.id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        // Entry updated successfully, you can handle the response here
        const updatedEntry = await response.json();
        onEdit(updatedEntry); // Update the state or perform any necessary actions
      } else {
        // Handle the error response if needed
      }
    } catch (error) {
      // Handle any network or other errors
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Editar Entrada</h2>
      <div>
        <label>Imagen:</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
      </div>
      {photos.map((photo, index) => (
        <div key={index}>
          <img
            src={URL.createObjectURL(photo)}
            alt={`Image ${index}`}
            width="100"
            height="100"
          />
          <button onClick={() => handleRemoveImage(index)}>Borrar</button>
        </div>
      ))}
      <div>
        <label>Descripción:</label>
        <textarea
          rows="4"
          cols="50"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      <button onClick={handleEdit}>Guardar Cambios</button>
    </div>
  );
};

export default EditEntryForm;
