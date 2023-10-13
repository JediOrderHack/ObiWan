import mysql from "mysql2/promise.js";
import getPool from "./pool.js";

const init = async () => {
  let connection;

  try {
    connection = await getPool();

    console.log("---- Iniciando modificación de la base de datos ----");
    console.log("Borrando tablas");

    // Borra todas las tablas existentes, si las hay
    await connection.query("DROP TABLE IF EXISTS likes");
    await connection.query("DROP TABLE IF EXISTS photos");
    await connection.query("DROP TABLE IF EXISTS comments");
    await connection.query("DROP TABLE IF EXISTS videos");
    await connection.query("DROP TABLE IF EXISTS chat_messages"); // Nueva tabla
    await connection.query("DROP TABLE IF EXISTS chat_room_membership"); // Nueva tabla
    await connection.query("DROP TABLE IF EXISTS chat_rooms"); // Nueva tabla
    await connection.query("DROP TABLE IF EXISTS entries");
    await connection.query("DROP TABLE IF EXISTS users");

    console.log("Tablas borradas\n");

    console.log("Creando nuevas tablas\n");
    // Users
    console.log("- Creando tabla users");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users(
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(30) UNIQUE NOT NULL,
        email VARCHAR(75) UNIQUE NOT NULL,
        password VARCHAR(125) NOT NULL,
        avatar VARCHAR(100),
        role ENUM('admin', 'normal') DEFAULT 'normal',
        registrationCode VARCHAR(100),
        recoveryPassCode VARCHAR(100),
        active BOOLEAN DEFAULT false,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("- Tabla users creada\n");

    // Entries
    console.log("- Creando tabla entries");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS entries(
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        description VARCHAR(500) NOT NULL,
        userId INT UNSIGNED NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);
    console.log("- Tabla entries creada\n");

    // Likes
    console.log("- Creando tabla Likes");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS likes(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        userId INT UNSIGNED NOT NULL,
        postId INT UNSIGNED NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (postId) REFERENCES entries(id)
      )
    `);
    console.log("- Tabla Likes creada\n");

    // Photos
    console.log("- Creando tabla photos");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS photos(
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        entryId INT UNSIGNED NOT NULL,
        photoName VARCHAR(100) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (entryId) REFERENCES entries(id)
      )
    `);
    console.log("- Tabla photos creada\n");

    // Crear la tabla "comments"
    console.log("- Creando tabla comments");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        entryId INT UNSIGNED NOT NULL,
        userId INT UNSIGNED NOT NULL,
        commentText TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (entryId) REFERENCES entries(id),
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);
    console.log("- Tabla comments creada\n");

    // Videos
    console.log("- Creando tabla videos");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        entryId INT UNSIGNED NOT NULL,
        videoName VARCHAR(100) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (entryId) REFERENCES entries(id)
      )
    `);
    console.log("- Tabla videos creada\n");

    // Nuevas tablas para el sistema de chat

    // Tabla de Salas de Chat
    console.log("- Creando tabla chat_rooms");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS chat_rooms (
        room_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        room_name VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("- Tabla chat_rooms creada\n");

    // Tabla de Membresía de Usuarios en Salas de Chat
    console.log("- Creando tabla chat_room_membership");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS chat_room_membership (
        membership_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        userId INT UNSIGNED NOT NULL,
        room_id INT UNSIGNED NOT NULL,
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("- Tabla chat_room_membership creada\n");

    // Tabla de Mensajes de Chat
    console.log("- Creando tabla chat_messages");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        message_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        room_id INT UNSIGNED NOT NULL,
        userId INT UNSIGNED NOT NULL,
        message_text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("- Tabla chat_messages creada\n");

    console.log("Tablas creadas");

    console.log("-------------- db Lista --------------");
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
};

init();