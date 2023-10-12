// URL base del API.
const baseURL = import.meta.env.VITE_API_URL;

// Importamos la función que retorna el token.
import { getToken } from '../utils/getToken';

// Obtener listado de entradas.
export const getEntriesService = async () => {
    const token = getToken();

    const res = await fetch(`${baseURL}/entries`, {
      headers: token ? {Authorization: token} : {},
    });

    const body = await res.json();

    return body;
};

