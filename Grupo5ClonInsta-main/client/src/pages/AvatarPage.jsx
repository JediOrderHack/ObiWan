// Importamos los hooks.
import useAuth from '../../hooks/useAuth';

// Importamos los componentes.
import { Navigate } from 'react-router-dom';
import AvatarForm from '../forms/AvatarForm/AvatarForm';

const AvatarPage = () => {
    const { authUser, authForm, loading } = useAuth();

    // Si la persona está autenticada redirigimos a la página principal.
    if (authUser) return <Navigate to="/" />;

    return (
        <main>
            <AvatarForm authForm={authForm} loading={loading} />
        </main>
    );
};

export default AvatarPage;
