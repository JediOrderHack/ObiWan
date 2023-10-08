import getPool from "../pool.js";
import ContentError from "../../errors/content_error.js";


async function getEntryBy(obj) {
  const userId = obj.userId || 0;
  delete obj.userId;

  // Agregar un registro de depuración para verificar los valores de obj
  console.log("Valores de obj:", obj);

  const queryStr = Object.entries(obj)
    .map((arr) => `entries.${arr[0]} = ?`)
    .join(" AND ");

  // Agregar un registro de depuración para verificar queryStr
  console.log("queryStr:", queryStr);

  let connection;

  try {
    connection = await getPool();
    const [entry] = await connection.query(
  `SELECT entries.*, users.username AS owner, GROUP_CONCAT(photos.photoName) AS photos
  FROM entries
  LEFT JOIN users ON entries.userId = users.id
  LEFT JOIN photos ON entries.id = photos.entryId
  LEFT JOIN videos ON entries.id = videos.entryId
  WHERE ${queryStr}
  GROUP BY entries.id`,
      [obj.id]
    );
console.log("Resultados de la consulta SQL:", entry);
    // Si no se encuentra la entrada, devolvemos null
    if (!entry.length) {
      return null;
    }

    // Si obtienes resultados, divídelos en un array de nombres de fotos
    const photos = entry[0].photos;
    entry[0].photos = photos ? photos.split(",") : [];

    return entry[0];
  } catch (error) {
    console.error("Error en getEntryBy:", error);
    return error;
  } finally {
    if (connection) connection.release();
  }
}

async function getEntriesWithLikesAndPhotosByDescription(description) {
  let connection;

  try {
    connection = await getPool();

    const rows = await connection.query(
      `SELECT
        e.id,
        e.description,
        e.userId,
        e.createdAt,
        u.username AS owner,
        GROUP_CONCAT(p.photoName) AS photos,
        MAX(v.videoName) AS video,
        (SELECT COUNT(*) FROM likes WHERE post_id = e.id) AS likesCount,
        (SELECT GROUP_CONCAT(commentText) FROM comments c WHERE c.entryId = e.id) AS comments
      FROM entries e
      LEFT JOIN users u ON e.userId = u.id
      LEFT JOIN photos p ON e.id = p.entryId
      LEFT JOIN videos v ON e.id = v.entryId
      WHERE e.description LIKE ?
      GROUP BY e.id, e.description, e.userId, e.createdAt, owner`,
      [`%${description}%`]
    );

    // Obtener la primera fila del resultado (si existe)
    const firstRow = rows[0];

    if (firstRow) {
      return [firstRow];
    } else {
      // Devolver un array vacío si no hay resultados
      return [];
    }
  } catch (error) {
    return error;
  } finally {
    if (connection) connection.release();
  }
}

async function newEntry({ description, userId, photos }) {
  let connection;

  try {
    connection = await getPool();
    console.log("Descripción:", description);
    console.log("UserID:", userId);
    console.log("Fotos:", photos);

    // Obtén el valor autoincremental de entryId
    const [insertedEntry] = await connection.query(
      "INSERT INTO entries (description, userId) VALUES (?, ?)",
      [description, userId]
    );

    // Aquí estamos insertando una nueva entrada en la tabla 'entries' y obteniendo el valor autoincremental.
    const entryId = insertedEntry.insertId;

    if (photos && photos.length > 0) {
      for (const photoName of photos) {
        console.log("Insertando foto:", photoName);
        await insertPhoto({ photoName, entryId });
        console.log("Foto insertada:", photoName);
    
      }
    }

    const entry = await getEntryBy({ id: entryId, userId });
    if (entry instanceof Error) throw entry;

    return entry;
  } catch (error) {
    console.error("Error en newEntry:", error);
    return error;
  } finally {
    if (connection) connection.release();
  }
}

async function updateEntry({ id, userId, description }) {
  let connection;

  try {
    connection = await getPool();

    await connection.query(
      "UPDATE entries SET description = ?, modifiedAt = NOW() WHERE id = ? AND userId = ?",
      [description, id, userId]
    );

    const entry = await getEntryBy({ id, userId });
    if (entry instanceof Error) throw entry;

    return entry;
  } catch (error) {
    return error;
  } finally {
    if (connection) connection.release();
  }
}

async function getAllEntries() {
  try {
    const connection = await getPool();
    const [entries] = await connection.query(`
      SELECT
        e.id AS id,
        e.description AS description,
        e.createdAt AS createdAt,
        e.userId AS userId,  -- Agregado para mostrar el userId
        u.username AS owner,
        GROUP_CONCAT(p.photoName) AS photos,
        NULL AS video,
        COUNT(DISTINCT l.id) AS likesCount,
        GROUP_CONCAT(DISTINCT c.commentText) AS comments
      FROM entries e
      LEFT JOIN users u ON e.userId = u.id
      LEFT JOIN photos p ON e.id = p.entryId
      LEFT JOIN likes l ON e.id = l.post_id
      LEFT JOIN (
        SELECT entryId, GROUP_CONCAT(commentText) AS commentText
        FROM comments
        GROUP BY entryId
      ) c ON e.id = c.entryId
      GROUP BY e.id
   `);
    connection.release();
    return entries;
  } catch (error) {
    throw error;
  }
}
const getAllPhotos = async () => {
  const connection = await getPool();

  try {
    // Realiza la consulta SQL para obtener todas las fotos
    const [rows] = await connection.query("SELECT * FROM photos");
    return rows;
    console.log(rows)
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

async function insertPhoto({ photoName, entryId }) {
  let connection;

  try {
    connection = await getPool();

    const [entry] = await connection.query(
      "INSERT INTO photos(entryId, photoName) VALUES(?, ?)",
      [entryId, photoName]
    );

    return {
      id: entryId,
      photo: photoName,
    };
  } catch (error) {
    return error;
  } finally {
    if (connection) connection.release();
  }
}

async function destroyPhoto({ id }) {
  let connection;

  try {
    connection = await getPool();

    await connection.query("DELETE FROM photos WHERE id = ?", [id]);

    return {
      id: id,
    };
  } catch (error) {
    return error;
  } finally {
    if (connection) connection.release();
  }
}

async function getPhotoById(photoId) {
  let connection;

  try {
    connection = await getPool();

    const [photo] = await connection.query(
      "SELECT * FROM photos WHERE id = ?",
      [photoId]
    );

    if (photo && photo.length > 0) {
      return photo[0]; // Se encontró una foto con el ID proporcionado
    }

    return null; // No se encontró la foto
  } catch (error) {
    console.error("Error en getPhotoById:", error);
    return error;
  } finally {
    if (connection) connection.release();
  }
}

async function addLike({ entryId, userId }) {
  let connection;

  try {
    connection = await getPool();

    const [existingLike] = await connection.query(
      "SELECT id FROM likes WHERE post_id = ? AND user_id = ?",
      [entryId, userId]
    );

    if (existingLike.length > 0) {
      throw new Error("El usuario ya ha dado like a esta entrada");
    }

    await connection.query(
      "INSERT INTO likes (post_id, user_id) VALUES (?, ?)",
      [entryId, userId]
    );

    return "Like agregado correctamente";
  } catch (error) {
    return error;
  } finally {
    if (connection) connection.release();
  }
}

async function removeLike({ entryId, userId }) {
  let connection;

  try {
    connection = await getPool();

    await connection.query(
      "DELETE FROM likes WHERE post_id = ? AND user_id = ?",
      [entryId, userId]
    );

    return "Like eliminado correctamente";
  } catch (error) {
    return error;
  } finally {
    if (connection) connection.release();
  }
}



// async function getEntriesByDescription(description) {
//   let connection;

//   try {
//     connection = await getPool();

//     const [entries] = await connection.query(
//       "SELECT * FROM entries WHERE description LIKE ?",
//       [`%${description}%`]
//     );

//     return entries;
//   } catch (error) {
//     console.error("Error en getEntriesByDescription:", error);
//     return error;
//   } finally {
//     if (connection) connection.release();
//   }
// }
// Función para obtener todas las entradas con el número de "likes"
const getAllEntriesWithLikes = async (keyword, userId) => {
  const entries = await getAllEntries({ keyword, userId });

  // Itera a través de las entradas y obtiene el número de "likes" para cada una
  const entriesWithLikes = await Promise.all(
    entries.map(async (entry) => {
      const likesCount = await getLikesCount(entry.id);
      return { ...entry, likes: likesCount };
    })
  );

  return entriesWithLikes;
};
async function getEntryWithLikesAndPhotos(entryId, userId) {
  let connection;

  try {
    connection = await getPool();

    const [entryWithLikesPhotosAndComments] = await connection.query(
      `SELECT
        e.id,
        e.description,
        e.userId,
        e.createdAt,
        u.username AS owner,
        GROUP_CONCAT(p.photoName) AS photos,
        MAX(v.videoName) AS video,
        (SELECT COUNT(*) FROM likes WHERE post_id = e.id) AS likesCount,
        (SELECT GROUP_CONCAT(commentText) FROM comments c WHERE c.entryId = e.id) AS comments
      FROM entries e
      LEFT JOIN users u ON e.userId = u.id
      LEFT JOIN photos p ON e.id = p.entryId
      LEFT JOIN videos v ON e.id = v.entryId
      WHERE e.id = ?
      GROUP BY e.id, e.description, e.userId, e.createdAt, owner`,
      [entryId]
    );

    return entryWithLikesPhotosAndComments[0];
  } catch (error) {
    return error;
  } finally {
    if (connection) connection.release();
  }
}


const getLikesCount = async (entryId) => {
  let connection;

  try {
    connection = await getPool();

    const [likesCountResult] = await connection.query(
      "SELECT COUNT(id) AS likesCount FROM likes WHERE post_id = ?",
      [entryId]
    );

    // Devuelve el número de "likes" como un valor entero
    return likesCountResult[0].likesCount;
  } catch (error) {
    console.error("Error en getLikesCount:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// Función para insertar un comentario en la base de datos
async function insertComment({ entryId, userId, commentText }) {
  const pool = await getPool();

  const query = `
    INSERT INTO comments (entryId, userId, commentText)
    VALUES (?, ?, ?)
  `;

  const values = [entryId, userId, commentText];

  try {
    const [result] = await pool.execute(query, values);
    const insertedCommentId = result.insertId;

    // Recupera el comentario recién insertado
    const [commentData] = await pool.execute(
      'SELECT * FROM comments WHERE id = ?',
      [insertedCommentId]
    );

    if (commentData.length === 0) {
      return null;
    }

    return commentData[0];
  } catch (error) {
    throw error;
  }
}

// Función para borrar un comentario de la base de datos por su ID
async function deleteCommentById(commentId) {
  const pool = await getPool();

  const query = 'DELETE FROM comments WHERE id = ?';

  try {
    const [result] = await pool.execute(query, [commentId]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
}

// Función para obtener una entrada por su ID
async function getEntryById(entryId) {
  // Obtén una conexión del pool
  const connection = await getPool();

  try {
    // Consulta SQL para buscar la entrada por su ID
    const query = 'SELECT * FROM entries WHERE id = ?';
    
    // Ejecuta la consulta y obtén el resultado
    const [rows] = await connection.query(query, [entryId]);

    // Verifica si se encontró una entrada
    if (rows.length === 0) {
      return null; // No se encontró la entrada
    }

    // Devuelve la entrada encontrada
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    // Libera la conexión de vuelta al pool
    if (connection) connection.release();
  }
}

// Función para obtener un comentario por su ID
async function getCommentById(commentId) {
  // Obtén una conexión del pool
  const connection = await getPool();

  try {
    // Consulta SQL para buscar el comentario por su ID
    const query = 'SELECT * FROM comments WHERE id = ?';
    
    // Ejecuta la consulta y obtén el resultado
    const [rows] = await connection.query(query, [commentId]);

    // Verifica si se encontró un comentario
    if (rows.length === 0) {
      return null; // No se encontró el comentario
    }

    // Devuelve el comentario encontrado
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    // Libera la conexión de vuelta al pool
    if (connection) connection.release();
  }
}
async function insertVideo({  videoName,entryId }) {
  let connection;

  try {
    connection = await getPool();

    const [entry] = await connection.query(
      "INSERT INTO videos(entryId, videoName) VALUES(?, ?)",
      [entryId, videoName]
    )
    return{
      id: entryId,
      video: videoName,
    }
  } catch (error) {
    console.error("Error en insertVideo:", error);
    return error // Puedes considerar lanzar el error para que sea manejado en el nivel superior.
  } finally {
    if (connection) connection.release();
  }
}

async function checkVideoLimit(entryId) {
  let connection;

  try {
    connection = await getPool();

    const [result] = await connection.query(
      "SELECT COUNT(*) AS videoCount FROM videos WHERE entryId = ?",
      [entryId]
    );

    return result[0].videoCount >= 1;
  } catch (error) {
    console.error("Error en checkVideoLimit:", error);
    return error; // Puedes considerar lanzar el error para que sea manejado en el nivel superior.
  } finally {
    if (connection) connection.release();
  }
}

async function destroyVideo ({id}){
  let connection;

  try{
    connection = await getPool()

    await connection.query("DELETE FROM videos WHERE id = ?", [id])
    
    return{id: id,
    }
  }catch(error){
    return error
  } finally{
    if (connection) connection.release()
  }
}

async function getVideoById(videoId){
  let connection

  try{
    connection = await getPool()

    const [video] =await connection.query(
      "SELECT * FROM videos WHERE id = ?",
      [videoId]
    )

    if (video && video.length > 0){
      return video[0]
    }

    return null
  }catch (error){
    console.error("Error en getVideobyId", error)
    return error
  }finally{
    if (connection) connection.release()
  }
}

export {
  getCommentById,
  getEntryById,
  deleteCommentById,
  insertComment,
  getLikesCount,
  getEntryBy,
  newEntry,
  updateEntry,
  getAllEntries,
  insertPhoto,
  destroyPhoto,
  addLike, 
  removeLike,
  getPhotoById,
  getEntriesWithLikesAndPhotosByDescription,
  getAllEntriesWithLikes,
  getEntryWithLikesAndPhotos,
  insertVideo,
  checkVideoLimit,
  destroyVideo,
  getVideoById,
  getAllPhotos
};

