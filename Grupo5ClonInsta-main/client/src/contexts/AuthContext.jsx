// Importamos los prop-types.
import PropTypes from 'prop-types';

// Importamos la función que crea un contexto y los hooks.
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importamos los servicios.
import {
    getPrivateProfile,
    signInService,
    signUpService,
    updateAvatarService,
} from '../services/authService';

// Importamos las constantes.
import { TOKEN_LOCAL_STORAGE_KEY } from '../utils/constants';

// Importamos la función que retorna el token.
import { getToken } from '../utils/getToken';

// Creamos el contexto de autenticación.
export const AuthContext = createContext(null);

// Creamos el componente provider del contexto.
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [authUser, setAuthUser] = useState(null);
    const [authToken, setAuthToken] = useState(getToken());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Función que retorna los datos del usuario.
        const fetchUser = async () => {
            try {
                setLoading(true);

                const body = await getPrivateProfile();

                if (body.status === 'error') {
                    throw new Error(body.message)
                }
                setAuthUser(body.data.user);
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        // Si existe token buscamos los datos del usuario.
        if (authToken) fetchUser();
    }, [authToken]);

    // Función que registra a un usuario en la base de datos.
     const authRegister = async (
        username,
        email,
        password
    ) => {
        try {
            setLoading(true);

            const body = await signUpService(username, email, password);

            if (body.status === 'error') {
                throw new Error(body.message)
            }

            // Una vez registrados redirigimos a la página de login.
            navigate('/login');
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Función que logea a un usuario retornando un token.
    const authLogin = async (username, password) => {
        try {
            setLoading(true);

            const body = await signInService(username, password);

            if (body.status === 'error') {
                throw new Error(body.message)
            }

            // Almacenamos el token en el localStorage. Dado que la variable token es un string no es
            // necesario usar JSON.stringify.
            localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, body.data.token);

            // Indicamos que el usuario está autorizado.
            setAuthToken(body.data.token);
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Función de logout.
    const authLogout = () => {
        // Eliminamos el token del localStorage.
        localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY);

        // Establecemos el usuario a null y isAuthenticated a false.
        setAuthUser(null);
        setAuthToken(null);
    };

    // Función que actualiza el avatar.
    const authUpdateAvatar = async (avatar) => {
        try {
            setLoading(true);

            // Creamos un objeto formData para agregar el avatar.
            const formData = new FormData();
            
            formData.append('avatar', avatar);

            const body = await updateAvatarService(formData);

            if (body.status === 'error') {
                throw new Error(body.message)
            }

            // Actualizamos el avatar del usuario en el State.
            setAuthUser({
                ...authUser,
                avatar: body.users[0].avatar
            })
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                authUser,
                isAuthenticated: authToken,
                authRegister,
                authLogin,
                authLogout,
                authUpdateAvatar,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};