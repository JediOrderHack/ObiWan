//import { useUpload } from "../../contexts/UploadContext";
import avatar from "../../assets/avatar-1.png";
import img from "../../assets/img-1.jpg";

import "./Profile.css";
import { NavLink } from "react-router-dom";
const IMAGES_URL = "http://localhost:3000/uploads";

const Profile = (props) => {
  const {
    avatar,
    username,
    entries
  } = props
  const getImageUrl = (photoName) => {
    return `${IMAGES_URL}/${photoName}`
  }
 // const { isUpload } = useUpload();
  return (

        <div className="profile_container">
          <NavLink to="/perfil">
            <div className="profile_top">
              <div className="avatar">
              <img src={getImageUrl(avatar)} alt="" />
              </div>
              <p>@{username}</p>
            </div>
          </NavLink>

          <div className="profile_posts">
            {entries.map((entry, index) => (  
              <div key={`entry_${entry.id}_${index}`}>
                  {entry.photos &&
                    entry.photos.map((photo, photoIndex) => (
                      <img            
                        src={getImageUrl(photo.photoName)}
                      />
                    ))}
                </div>
              
            ))}
          </div>
        </div>

  );
};

export default Profile;
