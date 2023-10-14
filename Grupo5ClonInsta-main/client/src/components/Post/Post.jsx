import { Carousel } from "react-responsive-carousel";

import avatar from "../../assets/avatar-1.png";
import post_img from "../../assets/img-1.jpg";
import thumb_icon from "../../assets/thumb-icon.png";
import comment_icon from "../../assets/comment-icon.png";

import "./Post.css";

const IMAGES_URL = "http://localhost:3000/uploads";

const imageStyles = {
  marginTop: "50px",
  maxWidth: "80%", // Establece un ancho máximo del 80% del contenedor
  // maxHeight: "60vh", // Establece una altura máxima del 60% del viewport height
};

const Post = (props) => {
  const {
    avatar,
    description,
    entryId,
    photos = [],
    title,
    username,
  } = props

  const getImageUrl = (photoName) => {
    return `${IMAGES_URL}/${photoName}`
  }

  return (
    <div className="post_container">
      <div className="post_top">
        <div className="user_info">
          <div className="avatar">
            <img src={getImageUrl(avatar)} alt="" />
          </div>
          {/* <p> {username}: @{username}</p> */}
          <p> @{username}</p>
        </div>

        <div className="post_img">
          <Carousel>
            {photos &&
              photos.map((photo, photoIndex) => (
                <div key={`photo_${entryId}_${photoIndex}`}>
                  <img
                    src={getImageUrl(photo.photoName)}
                    alt={`Foto ${photoIndex + 1}`}
                    style={imageStyles}
                  />
                </div>
              ))}
          </Carousel>
        </div>
      </div>

      <div className="post_bottom">
        <div className="post_bottom_top">
          <div className="btn_container">
            <button>
              <img src={thumb_icon} alt="" />
            </button>
            <button>
              <img src={comment_icon} alt="" />
            </button>
          </div>

          <p className="post_title">{username}: {description}</p>
        </div>

        <div className="post_bottom_bottom">
          
        </div>
      </div>
    </div>
  );
};

export default Post;
