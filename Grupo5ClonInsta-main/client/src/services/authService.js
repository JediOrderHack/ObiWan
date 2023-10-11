// URL base del API.
const baseURL = import.meta.env.VITE_API_URL;

// Importamos la función que retorna el token.
import { getToken } from '../utils/getToken';

// Registro de usuario.
export const signUpService = async (username, email, password) => {
    const res = await fetch(`${baseURL}/users/`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
            password,
        }),
    });

    const body = await res.json();

    return body;
};

// Login de usuario.
export const signInService = async (email, password) => {
    const res = await fetch(`${baseURL}/users/login`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const body = await res.json();

    return body;
};

// Obtener el perfil privado de un usuario.
export const getPrivateProfile = async () => {
    const token = getToken();

    const res = await fetch(`${baseURL}/users`, {
        headers: {
            Authorization: token,
        },
    });

    const body = await res.json();

    return body;
};

// Login de usuario.
export const updateAvatarService = async (formData) => {
    const token = getToken();

    const res = await fetch(`${baseURL}/users/avatar`, {
        method: 'put',
        headers: {
            Authorization: token,
        },
        body: formData
    });

    const body = await res.json();

    return body;
};