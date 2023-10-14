import React, { useState } from 'react';

const LikeButton = ({ postId }) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    // Verificamos si el usuario ya ha dado like a la publicación.
    if (!isLiked) {
      // Si no ha dado like, lo hacemos y aumentamos el número de likes.
      setIsLiked(true);
      setLikes(likes + 1);
    } else {
      // Si ya ha dado like, lo quitamos y disminuimos el número de likes.
      setIsLiked(false);
      setLikes(likes - 1);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={isLiked ? 'liked' : ''}
    >
      {isLiked ? <i className="fas fa-heart"></i> : <i className="far fa-heart"></i>}
      {likes}
    </button>
  );
};
export default LikeButton