import {
    newRoom,
    sendMessage,
    getMessagesByRoomId
} from '../db/queries/chat_queries.js'
import joi from 'joi'
//Errors
import NotFoundError from "../errors/not_found_error.js";
import ContentError from "../errors/content_error.js";
import AuthError from "../errors/auth_error.js"; 
import EntryNotFound from '../errors/not-found-entry.js';

async function createRoom(req, res) {
  try {
    const { username } = req.user;
    const { targetUser } = req.body; // Asume que el nombre del usuario objetivo se encuentra en el cuerpo de la solicitud.

    if (!username || !targetUser) {
      return res
        .status(400)
        .json({ error: "Faltan datos de usuario válidos en la solicitud." });
    }

    // Genera el nombre de la sala con el nombre de usuario actual y el usuario objetivo.
    const roomName = `Sala con ${targetUser}`;

    // Crea una nueva sala de chat
    const room = await newRoom(roomName);
    if (room instanceof Error) throw room;

    // Devuelve una respuesta de éxito
    return res.send({
      status: "ok",
      data: {
        roomName,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear la sala de chat." });
  }
}
async function sendChatMessage(req, res) {
  try {
    const { messageText } = req.body;
    const roomId = req.params.id; // Obtén el identificador de la sala desde los parámetros de la URL
    const userId = req.user.id
    if (!roomId || !messageText || !userId) {
      return res
        .status(400)
        .json({ error: "Faltan datos de mensaje válidos en la solicitud." });
    }


    const result = await sendMessage(roomId, userId, messageText);

    if (result instanceof Error) throw result;

    // Enviar una respuesta exitosa
    return res.send({
      status: "ok",
      data: {
        roomId,
        userId,
        messageText
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al enviar el mensaje." });
  }
}

async function getMessages(req, res) {
  try {
    const roomId = req.params.id; // Obtén el identificador de la sala desde los parámetros de la URL

    if (!roomId) {
      return res
        .status(400)
        .json({ error: "Falta el identificador de la sala en la solicitud." });
    }

    // Llama a una función que obtenga los mensajes de la sala
    const messages = await getMessagesByRoomId(roomId);

    if (messages instanceof Error) throw messages;

    // Enviar una respuesta con los mensajes
    return res.send({
      status: "ok",
      data: {
        messages,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener los mensajes." });
  }
}



export { createRoom,
        sendChatMessage,
        getMessages
};


