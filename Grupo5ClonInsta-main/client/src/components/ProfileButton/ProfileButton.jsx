import { getToken } from "../../utils/getToken";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const UPLOADS_DIR = "http://localhost:3000/uploads";

const ProfileButton = () => {
  const [user, setUser] = useState(null);
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/users/", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setUser(response.data.data.user);
        console.log(response.data.data.user);
      })
      .catch((error) => {
        console.error("Error al obtener el perfil privado:", error);
      });
  }, []);

  const handleProfileClick = () => {
    if (token) {
      navigate("/perfil");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="profile-button" onClick={handleProfileClick}>
      {user && user.avatar ? (
        <Link to="/perfil">
          <img src={`${UPLOADS_DIR}/${user.avatar}`} alt="Avatar" />
        </Link>
      ) : (
        <Link to="/perfil">
          <img src={`${UPLOADS_DIR}/DefaultAvatar.png`} alt="Avatar por defecto" />
        </Link>
      )}
    </div>
  );
};

export default ProfileButton;
