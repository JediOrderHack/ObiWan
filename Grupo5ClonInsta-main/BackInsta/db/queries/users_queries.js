import getPool from "../pool.js";

// Errors
import AuthError from "../../errors/auth_error.js";
import ValidationError from "../../errors/validation_error.js";

async function getUserWithAll(obj) {
  const queryStr = Object.entries(obj)
    .map((arr) => `${arr[0]} = '${arr[1]}'`)
    .join(" AND "); // Utilizamos "AND" para combinar las condiciones

  let connection;

  try {
    connection = await getPool();

    const [user] = await connection.query(
      `SELECT * FROM users WHERE ${queryStr}`
    );

    if (user.length === 0) {
      return null; // Retorna null si no se encuentra el usuario
    }

    // Obtenemos las relaciones del usuario
    const userId = user[0].id;
    const [entries] = await connection.query(
      `SELECT * FROM entries WHERE userId = ${userId}`
    );
    const [photos] = await connection.query(
      `SELECT * FROM photos WHERE entryId IN (SELECT id FROM entries WHERE userId = ${userId})`
    );
    const [videos] = await connection.query(
      `SELECT * FROM videos WHERE entryId IN (SELECT id FROM entries WHERE userId = ${userId})`
    );
    const [likes] = await connection.query(
      `SELECT * FROM likes WHERE user_id = ${userId}`
    );
    const [comments] = await connection.query(
      `SELECT * FROM comments WHERE userId = ${userId}`
    );

    user[0].entries = entries;
    user[0].photos = photos;
    user[0].likes = likes;
    user[0].comments = comments;

    return user[0];
  } catch (error) {
    console.error("Error en getUserBy:", error);
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

async function newUser({ email, username, password, registrationCode }) {
  let connection;

  try {
    connection = await getPool();

    // Comprobamos si el email está repetido.
    let user = await getUserBy({ email });
    if (user instanceof Error) throw user;

    // Si el array de usuarios tiene más de 0 usuarios quiere decir que el email está repetido.
    if (user)
      throw new AuthError({ message: "Ya existe un usuario con ese email" });

    // Comprobamos si el nombre de usuario está repetido.
    user = await getUserBy({ username });
    if (user instanceof Error) throw user;

    // Si el array de usuarios tiene más de 0 usuarios quiere decir que el nombre de usuario está repetido.
    if (user)
      throw new AuthError({ message: "Nombre de usuario no disponible" });

    // Insertamos el usuario en la base de datos.
    const [result] = await connection.query(
      "INSERT INTO users (email, username, password, registrationCode, createdAt) VALUES(?, ?, ?, ?, ?)",
      [email, username, password, registrationCode, new Date()]
    );
    user = await getUserBy({ id: result.insertId });
    if (user instanceof Error) throw user;

    return user;
  } catch (error) {
    return error;
  } finally {
    if (connection) connection.release();
  }
}

async function updateUserRegCode({ registrationCode }) {
  let connection;

  try {
    connection = await getPool();

    // Intentamos localizar a un usuario con el código de registro que nos llegue.
    const user = await getUserBy({ registrationCode });
    if (user instanceof Error) throw user;

    // Si no hay usuarios con ese código de registro lanzamos un error.
    if (!user)
      throw new ValidationError({
        message: "Código no encontrado",
        status: 404,
      });

    // Si existe el usuario, lo actualizamos.
    await connection.query(
      "UPDATE users SET active = true, registrationCode = null, modifiedAt = ? WHERE id = ?",
      [new Date(), user.id]
    );
  } catch (error) {
    return error;
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

async function updateUserPass({ recoveryPassCode, newPass }) {
  let connection;

  try {
    connection = await getPool();

    // Comprobamos si existe algún usuario con ese código de recuperación.
    const user = await getUserBy({ recoveryPassCode });
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

async function getAllUser() {
  try {
    const connection = await getPool();
    const [users] = await connection.query(
      "SELECT id, username, avatar FROM users"
    );
    connection.release();
    return users;
  } catch (error) {
    throw error;
  }
}

export {
  getUserBy,
  newUser,
  updateUserRegCode,
  updateUserAvatar,
  updateUserRecoverPass,
  updateUserPass,
  getUserWithAll,
  getAllUser,
};
