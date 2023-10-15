import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = io("http://localhost:3000"); // Reemplaza 'URL_DE_TU_SERVIDOR' con la URL de tu servidor Socket.io

  useEffect(() => {
    // Escucha eventos de nuevos mensajes desde el servidor
    socket.on("newMessage", (message) => {
      setMessages([...messages, message]);
    });

    // Limpia la conexión del socket al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, [messages, socket]);

  const handleSendMessage = () => {
    // Envia el nuevo mensaje al servidor a través del socket
    socket.emit("sendMessage", newMessage);
    setNewMessage("");
  };

  return (
    <div>
      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className="message">
              {message}
            </div>
          ))}
        </div>
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default Chat;
