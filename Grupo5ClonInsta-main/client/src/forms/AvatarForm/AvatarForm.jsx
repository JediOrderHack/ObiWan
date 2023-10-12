// Importamos los hooks.
import { useState } from "react";

const AvatarForm = ({ authUpdateAvatar }) => {
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
      e.preventDefault();

      // Actualizamos el avatar.
      authUpdateAvatar(file)
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required/>
      <button>Subir foto de perfil</button>
    </form>
  );
};

export default AvatarForm;
