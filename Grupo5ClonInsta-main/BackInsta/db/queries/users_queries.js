import getPool from "../pool.js";

// Errors
import AuthError from "../../errors/auth_error.js";
import ValidationError from "../../errors/validation_error.js";
import generateError from "../../helpers/generate_error.js";

/**
 * ###################
 * ## Crear usuario ##
 * ###################
 */
async function insertuserQuery({
  email,
  username,
  password,
  registrationCode,
}) {
  let connection;

  try {
    connection = await getPool();

    // Comprobamos si existe un usuario con el nombre recibido.
    let [users] = await connection.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    // Si ya existe un usuario con ese nombre lanzamos un error.
    if (users.length > 0) {
      generateError(
        "Ya existe un usuario con ese nombre en la base de datos",
        409
      );
    }

    // Comprobamos si existe un usuario con el email recibido.
    [users] = await connection.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    // Si ya existe un usuario con ese email lanzamos un error.
    if (users.length > 0) {
      generateError(
        "Ya existe un usuario con ese email en la base de datos",
        409
      );
    }

    // Insertamos el usuario en la base de datos.
    await connection.query(
      "INSERT INTO users (email, username, password, registrationCode) VALUES(?, ?, ?, ?)",
      [email, username, password, registrationCode]
    );
  } finally {
    if (connection) connection.release();
  }
}

/**
 * #####################
 * ## Validar usuario ##
 * #####################
 */
async function updateUserRegCodeQuery({ registrationCode }) {
  let connection;

  try {
    connection = await getPool();

    // Intentamos localizar a un usuario con el código de registro que nos llegue.
    const [users] = await connection.query(
      "SELECT id FROM users WHERE registrationCode = ?",
      [registrationCode]
    );

    // Si no hay usuarios con ese código de registro lanzamos un error.
    if (users.length < 1) {
      generateError("Usuario no encontrado", 404);
    }

    // Activamos el usuario.
    await connection.query(
      "UPDATE users SET active = true, registrationCode = null WHERE registrationCode = ?",
      [registrationCode]
    );
  } finally {
    if (connection) connection.release();
  }
}

/**
 * ###################################
 * ## Seleccionar usuario por email ##
 * ###################################
 */
async function selectUserByEmailQuery({ email }) {
  let connection;

  try {
    connection = await getPool();

    const [users] = await connection.query(
      "SELECT id, password, active FROM users WHERE email = ?",
      [email]
    );

    if (users.length < 1) {
      generateError(
        "No existe ningún usuario con ese email en la base de datos",
        404
      );
    }

    return users[0];
  } finally {
    if (connection) connection.release();
  }
}

/**
 * ################################
 * ## Seleccionar usuario por id ##
 * ################################
 */
async function selectUserByIdQuery({ userId }) {
  let connection;

  try {
    connection = await getPool();

    const [users] = await connection.query(
      `SELECT id, username, email, avatar FROM users WHERE id = ?`,
      [userId]
    );

    if (users.length < 1) {
      generateError("Usuario no encontrado", 404);
    }

    return users[0];
  } finally {
    if (connection) connection.release();
  }
}

/**
 * ###################################
 * ## Seleccionar fotos del usuario ##
 * ###################################
 */
async function selectUserPhotosQuery({ publicUserId, tokenUserId }) {
  let connection;

  try {
    connection = await getPool();

    const [entries] = await connection.query(
      `
        SELECT
          e.id,
          e.description,
          e.userId,
          u.username,
          u.avatar,
          e.userId = ? AS owner,
          COUNT(DISTINCT l.id) AS likesCount,
          BIT_OR(l.userId = ?) AS likedByMe,
          e.createdAt
        FROM entries e
        INNER JOIN users u ON e.userId = u.id
        LEFT JOIN likes l ON e.id = l.postId
        WHERE e.userId = ?
        GROUP BY e.id
      `,
      [tokenUserId, tokenUserId, publicUserId]
    );

    // Recorremos el array de entradas.
    for (const entry of entries) {
      // Obtenemos las fotos de la entrada.
      const [photos] = await connection.query(
        `SELECT id, photoName FROM photos WHERE entryId = ?`,
        [entry.id]
      );

      // Agregamos a la entrada las fotos y los comentarios.
      entry.photos = photos;

      // Modificamos el valor de la propiedad "owner" de tipo Number a tipo Boolean.
      entry.owner = Boolean(entry.owner);

      // Hacemos lo mismo con "likedByMe".
      entry.likedByMe = Boolean(entry.likedByMe);
    }

    return entries;
  } finally {
    if (connection) connection.release();
  }
}

async function updateUserAvatar({ avatar, userId }) {
  let connection;

  try {
    connection = await getPool();

    // Actualizamos el avatar del usuario con su fecha de modificación.
    await connection.query(
      "UPDATE users SET avatar = ?, modifiedAt = ? WHERE id = ?",
      [avatar, new Date(), userId]
    );
  } catch (error) {
    console.error("Error en updateUserAvatar:", error);
    return error;
  } finally {
    if (connection) connection.release();
  }
}

async function getUserBy(obj) {
  const queryStr = Object.entries(obj)
    .map((arr) => `${arr[0]} = '${arr[1]}'`)
    .join(", ");
  let connection;

  try {
    connection = await getPool();

    const [user] = await connection.query(
      `SELECT * FROM users WHERE ${queryStr}`
    );
    return user[0];
  } catch (error) {
    console.error("Error en getUserBy:", error);
    return error;
  } finally {
    if (connection) connection.release();
  }
}

async function updateUserRecoverPass({ id, recoverPassCode }) {
  let connection;

  try {
    connection = await getPool();

    // Insertamos el recoveryPassCode en el usuario
    await connection.query(
      "UPDATE users SET recoveryPassCode = ?, modifiedAt = ? WHERE id = ?",
      [recoverPassCode, new Date(), id]
    );
  } catch (error) {
    return error;
  } finally {
    if (connection) connection.release();
  }
}
async function selectUserQuery(obj) {
  const queryStr = Object.entries(obj)
    .map((arr) => `${arr[0]} = '${arr[1]}'`)
    .join(", ");
  let connection;

  try {
    connection = await getPool();

    const [user] = await connection.query(
      `SELECT * FROM users WHERE ${queryStr}`
    );
    return user[0];
  } catch (error) {
    console.error("Error en getUserBy:", error);
    return error;
  } finally {
    if (connection) connection.release();
  }
}

async function updateUserPass({ recoveryPassCode, newPass }) {
  let connection;

  try {
    connection = await getPool();

    // Comprobamos si existe algún usuario con ese código de recuperación.
    const user = await selectUserQuery({ recoveryPassCode });
    if (user instanceof Error) throw user;

    // Si no hay ningún usuario con ese código de recuperación lanzamos un error.
    if (!user)
      throw new ValidationError({
        message: "Código de recuperación incorrecto",
        status: 404,
      });

    // Actualizamos el usuario.
    await connection.query(
      "UPDATE users SET password = ?, recoveryPassCode = null, modifiedAt = ? WHERE id = ?",
      [newPass, new Date(), user.id]
    );
  } catch (error) {
    return error;
  } finally {
    if (connection) connection.release();
  }
}





export {
  insertuserQuery,
  updateUserRegCodeQuery,
  selectUserByEmailQuery,
  selectUserByIdQuery,
  selectUserPhotosQuery,
  updateUserAvatar,
  updateUserRecoverPass,
  updateUserPass,
  selectUserQuery,
  getUserBy
};