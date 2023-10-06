// Importamos las constantes.
import { TOKEN_LOCAL_STORAGE_KEY } from './constants';

// Función que obtiene un token del localStorage.
export const getToken = () => {
    const authToken = localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY);
    return authToken ? authToken : null;
};
