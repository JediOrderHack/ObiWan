// Importamos la función que nos permite conectarnos con la base de datos.
import getPool from "../pool.js";

// Importamos la función que genera errores.
import generateError from "../../helpers/generate_error.js";

/**
 * ##########################
 * ## Insertar una entrada ##
 * ##########################
 */
async function insertEntryQuery({ description, userId }) {
  let connection;

  try {
    connection = await getPool();

    // Insertamos la entrada y obtenemos el ID que MySQL ha generado.
    const [entry] = await connection.query(
      "INSERT INTO entries (description, userId) VALUES (?, ?)",
      [description, userId]
    );

    // Retornamos el ID de la entrada.
    return entry.insertId;
  } finally {
    if (connection) connection.release();
  }
}

/**
 * #################################
 * ## Obtener listado de entradas ##
 * #################################
 */
async function selectAllEntriesQuery({ userId, search }) {
  const connection = await getPool();

  try {
    const [entries] = await connection.query(
      `
        SELECT
          e.id AS id,
          e.description AS description,
          e.createdAt AS createdAt,
          e.userId AS userId,
          u.username,
          u.avatar,
          e.userId = ? AS owner,
          COUNT(DISTINCT l.id) AS likesCount,
          BIT_OR(l.userId = ?) AS likedByMe
        FROM entries e
        INNER JOIN users u ON e.userId = u.id
        LEFT JOIN likes l ON e.id = l.postId
        WHERE e.description LIKE ?
        GROUP BY e.id
      `,
      [userId, userId, `%${search}%`]
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

/**
 * ######################################
 * ## Seleccionar una entrada concreta ##
 * ######################################
 */
async function selectEntryByIdQuery({ entryId, userId }) {
  let connection;

  try {
    console.log("Query de búsqueda - entryId:", entryId, "userId:", userId);
    connection = await getPool();

    const [entries] = await connection.query(
      `
        SELECT
          e.id,
          e.description,
          e.createdAt,
          e.userId,
          u.username,
          u.avatar,
          e.userId = ? AS owner,
          COUNT(DISTINCT l.id) AS likesCount,
          BIT_OR(l.userId = ?) AS likedByMe
        FROM entries e
        INNER JOIN users u ON e.userId = u.id
        LEFT JOIN likes l ON e.id = l.postId
        WHERE e.id = ?
        GROUP BY e.id
      `,
      [userId, userId, entryId]
    );

    console.log("Resultados de la primera consulta:", entries);

    if (entries.length < 1) {
      console.log("Entrada no encontrada");
      generateError("Entrada no encontrada", 404);
    }

    // Obtenemos las fotos de la entrada.
    const [photos] = await connection.query(
      `SELECT id, photoName FROM photos WHERE entryId = ?`,
      [entries[0].id]
    );

    console.log("Fotos de la entrada:", photos);

    // Agregamos a la entrada las fotos y los comentarios.
    entries[0].photos = photos;

    // Modificamos el valor de la propiedad "owner" de tipo Number a tipo Boolean.
    entries[0].owner = Boolean(entries[0].owner);

    // Hacemos lo mismo con "likedByMe".
    entries[0].likedByMe = Boolean(entries[0].likedByMe);

    return entries[0];
  } finally {
    if (connection) connection.release();
  }
}


/**
 * #################################
 * ## Editar una entrada concreta ##
 * #################################
 */
async function updateEntryQuery({ entryId, description }) {
  let connection;

  try {
    connection = await getPool();

    await connection.query("UPDATE entries SET description = ? WHERE id = ?", [
      description,
      entryId,
    ]);
  } finally {
    if (connection) connection.release();
  }
}

/**
 * #######################
 * ## Insertar una foto ##
 * #######################
 */
async function insertPhotoQuery({ photoName, entryId }) {
  let connection;

  try {
    connection = await getPool();

    // Insertamos la photo y obtenemos el ID que MySQL ha generado.
    const [photo] = await connection.query(
      "INSERT INTO photos(entryId, photoName) VALUES(?, ?)",
      [entryId, photoName]
    );

    // Retornamos el ID de la foto.
    return photo.insertId;
  } finally {
    if (connection) connection.release();
  }
}

/**
 * ##################
 * ## Agregar like ##
 * ##################
 */
async function insertLikeQuery({ entryId, userId }) {
  let connection;

  try {
    connection = await getPool();

    // Comprobamos si el usuario ya ha dado like a esta entrada.
    const [likes] = await connection.query(
      "SELECT id FROM likes WHERE postId = ? AND userId = ?",
      [entryId, userId]
    );

    // Si ya ha dado like lanzamos un error.
    if (likes.length > 0) {
      generateError("El usuario ya ha dado like a esta entrada", 403);
    }

    // Agregamos el like.
    await connection.query("INSERT INTO likes (postId, userId) VALUES (?, ?)", [
      entryId,
      userId,
    ]);
  } finally {
    if (connection) connection.release();
  }
}

/**
 * ###################
 * ## Eliminar like ##
 * ###################
 */
async function deleteLikeQuery({ entryId, userId }) {
  let connection;

  try {
    connection = await getPool();

    // Comprobamos que exista un like.
    const [likes] = await connection.query(
      "SELECT id FROM likes WHERE postId = ? AND userId = ?",
      [entryId, userId]
    );

    // Si no encontramos el like lanzamos un error.
    if (likes.length < 1) {
      generateError("Like no encontrado", 404);
    }

    await connection.query(
      "DELETE FROM likes WHERE postId = ? AND userId = ?",
      [entryId, userId]
    );
  } finally {
    if (connection) connection.release();
  }
}


// Define la consulta para verificar si un usuario ha dado "like" a una entrada específica.
async function checkEntryLikeQuery(userId, entryId) {
  const connection = await getPool();

  try {
    const [result] = await connection.query(
      "SELECT id FROM likes WHERE userId = ? AND postId = ?",
      [userId, entryId]
    );

    // Devuelve un valor booleano indicando si el usuario ha dado "like" a la entrada.
    return result.length > 0;
  } finally {
    if (connection) connection.release();
  }
}



export {
  insertEntryQuery,
  selectAllEntriesQuery,
  selectEntryByIdQuery,
  updateEntryQuery,
  insertPhotoQuery,
  insertLikeQuery,
  deleteLikeQuery,
  checkEntryLikeQuery
};
