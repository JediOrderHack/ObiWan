// Importamos los hooks.
import useAuth from '../hooks/useAuth';

// Importamos los componentes.
import { Navigate } from 'react-router-dom';
import AvatarForm from '../forms/AvatarForm/AvatarForm';

const AvatarPage = () => {
    const { authUser, authUpdateAvatar, loading } = useAuth();

    // Si la persona NO está autenticada redirigimos a la página principal.
    // if (!authUser) return <Navigate to="/home" />;

    return (
        <main>
            <AvatarForm authUser={authUser} authUpdateAvatar={authUpdateAvatar} loading={loading} />
        </main>
    );
};

export default AvatarPage;
