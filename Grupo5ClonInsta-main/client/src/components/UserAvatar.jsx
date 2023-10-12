import useAuth from "../hooks/useAuth";

const IMAGES_URL = "http://localhost:4000/images";

function UserAvatar() {
  const { authUser } = useAuth();

  return (
    authUser && <div className="user-avatar">
      <img src={`${IMAGES_URL}/${authUser.avatar}`} alt={authUser.name} />
      {/* <button onClick={onChatOpen}>Abrir Chat</button> */}
    </div>
  );
}

export default UserAvatar;
