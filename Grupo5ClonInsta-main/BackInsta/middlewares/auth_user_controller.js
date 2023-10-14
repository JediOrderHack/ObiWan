// Importamos las dependencias.
import jwt from "jsonwebtoken";

// Importamos las variables necesarias para la configuración.
import { SECRET } from "../config.js";

// Importamos la función que genera errores.
import generateError from "../helpers/generate_error.js";

// Función controladora intermedia que desencripta un token.
async function authUserController(req, res, next) {
  try {
    const { authorization } = req.headers;
console.log(authorization)
    // Si falta el token lanzamos un error.
    if (!authorization)
      generateError("Falta la cabecera de autenticación", 401);

    // Variable que almacenará la info del token una vez desencriptada.
    let tokenInfo;
    console.log(tokenInfo)

    try {
      tokenInfo = jwt.verify(authorization, SECRET);
console.log(tokenInfo)
      // Creamos una propiedad inventada por nosotros en el objeto request para añadir
      // los datos del usuario.
      req.user = tokenInfo;

      // Pasamos el control a la siguiente función controladora.
      next();
    } catch {
      generateError("Token inválido", 401);
    }
  } catch (err) {
    next(err);
  }
}

export default authUserController;
