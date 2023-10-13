import getPool from "../pool.js";

// Función para crear una nueva sala de chat en la base de datos
async function newRoom (roomName,) {
    console.log(roomName)
  try {
    // Conecta a la base de datos
    const connection = await getPool();

    // Inserta una nueva sala de chat en la base de datos
    const [result] = await connection.execute(
      "INSERT INTO chat_rooms (room_name) VALUES (?)",
      [roomName]
    );

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error al crear la sala de chat.");
  }
};

async function sendMessage(roomId, userId, messageText) {
  try {
    const connection = await getPool();

    const [result] = await connection.execute(
      "INSERT INTO chat_messages (room_id, userId, message_text) VALUES (?, ?, ?)",
      [roomId, userId, messageText]
    );

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error al enviar el mensaje.");
  }
}
async function getRoomIdByRoomName(roomName) {
  try {
    const connection = await getPool();

    const [rows] = await connection.execute(
      "SELECT room_id FROM chat_rooms WHERE room_name = ?",
      [roomName]
    );

    if (rows.length > 0) {
      return rows[0].room_id;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener el roomId de la sala.");
  }
}

async function getMessagesByRoomId(roomId) {
  try {
    const connection = await getPool();

    const [rows] = await connection.execute(
      "SELECT * FROM chat_messages WHERE room_id = ? ORDER BY created_at ASC",
      [roomId]
    );

    return rows;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener los mensajes de la sala.");
  }
}

export{
    newRoom,
    sendMessage,
    getRoomIdByRoomName,
    getMessagesByRoomId
}