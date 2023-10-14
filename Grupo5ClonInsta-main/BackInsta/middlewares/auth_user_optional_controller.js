// Importamos las dependencias.
import jwt from "jsonwebtoken";

// Importamos las variables necesarias para la configuración.
import { SECRET } from "../config.js";

// Importamos la función que genera errores.
import generateError from "../helpers/generate_error.js";

// Función controladora intermedia que desencripta opcionalmente un token.
async function authUserOptionalController(req, res, next) {
  try {
    const { authorization } = req.headers;
    console.log(authorization)
    // Si hay token creamos la propiedad user en el objeto request.
    if (authorization) {
      // Variable que almacenará la info del token una vez desencriptada.
      let tokenInfo;
    

      try {
        tokenInfo = jwt.verify(authorization, SECRET);

        req.user = tokenInfo;
        console.log(tokenInfo)
      } catch {
        generateError("Token inválido", 401);
      }
    }

    // Pasamos el control a la siguiente función controladora.
    next();
  } catch (err) {
    next(err);
  }
}

export default authUserOptionalController;
