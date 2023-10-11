// Importamos la función que comprueba si existe el usuario.
import { selectUserByIdQuery } from "../db/queries/users_queries.js";

// Función controladora intermedia que lanza un error si no existe el usuario.
async function userExistsController(req, res, next) {
  try {
    const userId = req.user?.id;

    // Comprobamos si existe el usuario. Si no existe, la propia función lanza un error 404.
    await selectUserByIdQuery({ userId });

    // Pasamos el control a la siguiente función controladora.
    next();
  } catch (err) {
    next(err);
  }
}

export default userExistsController;
