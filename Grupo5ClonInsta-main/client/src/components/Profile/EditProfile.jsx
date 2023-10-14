import { useUpload } from "../../context/UploadContext";
import Navigation from "../Navigation/Navigation";
import Upload from "../Upload/Upload";

import { FaPlus } from "react-icons/fa";

import avatar from "../../assets/avatar-1.png";

import "./Profile.css";
import { createRef, useState } from "react";

const EditProfile = () => {
  const { isUpload } = useUpload();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageClick = () => {
    // Trigger the hidden file input element
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const fileInputRef = createRef();

  return (
    <div className="app">
      <Navigation />

      <p className="title">Editar perfil</p>

      {isUpload ? (
        <Upload />
      ) : (
        <div className="edit_profile_container">
          <div className="avatar">
            {selectedImage ? (
              <img src={selectedImage} alt="Selected" width="200" />
            ) : (
              <img src={avatar} alt="" />
            )}
          </div>
          <p>Editar foto de perfil</p>
          <button onClick={handleAddImageClick}>
            <FaPlus />
          </button>

          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
            ref={fileInputRef}
          />
        </div>
      )}

      <footer>Made with ♥️</footer>
    </div>
  );
};

export default EditProfile;
