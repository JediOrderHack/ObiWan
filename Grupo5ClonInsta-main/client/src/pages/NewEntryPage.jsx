// Importamos los hooks.
import useAuth from '../../hooks/useAuth';

// Importamos los componentes.
import { Navigate } from 'react-router-dom';
import NewEntryForm from '../forms/NewEntryForm/NewEntryForm';


const NewEntryPage = () => {
    const { authUser, authForm, loading } = useAuth();

    // Si la persona está autenticada redirigimos a la página principal.
    if (authUser) return <Navigate to="/" />;

    return (
        <main>
            <NewEntryForm authForm={authForm} loading={loading} />
        </main>
    );
};

export default NewEntryPage;