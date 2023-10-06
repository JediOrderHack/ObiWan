import {Server} from "socket.io";
import http from 'http'

const chatConfig = (server) => {
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("A user connected");

    // Maneja la creación de una sala de chat cuando un usuario lo solicita
    socket.on("create-room", async (roomName, creator, targetUser) => {
      try {
        // Crea la sala de chat utilizando el controlador
        const result = await newRoom(roomName);

        // Notifica al usuario que inició la solicitud
        socket.emit("room-created", { roomName, roomId: result.insertId });

        // Notifica a todos los usuarios conectados sobre la creación de la sala
        io.emit("room-created", { roomName, roomId: result.insertId });
      } catch (error) {
        console.error("Error al crear la sala de chat:", error);
        // Maneja el error y notifica al usuario si es necesario
      }
    });
    socket.on("send-message", async (roomId, userId, messageText) => {
      try {
        // Utiliza los controladores para guardar el mensaje en la base de datos
        const result = await sendMessage(roomId, userId, messageText);

        if (result instanceof Error) {
          // Maneja el error, por ejemplo, emite un evento de error al usuario
          socket.emit("message-error", {
            error: "Error al guardar el mensaje en la base de datos",
          });
        } else {
          // Si el mensaje se guarda con éxito, emite un evento de notificación
          io.to(roomId).emit("message-sent", { roomId, userId, messageText });
        }
      } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        // Maneja el error y notifica al usuario si es necesario
        socket.emit("message-error", { error: "Error al enviar el mensaje" });
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return httpServer;
};

export default chatConfig;
