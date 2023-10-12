// Importamos las dependencias.
import http from "http";
import express from "express";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import cors from "cors";

// Importamos las variables necesarias para la configuración.
import { PORT, UPLOADS_DIR, VIDEO_DIR } from "./config.js";

// Importamos la configuración del chat.
import chatConfig from "./services/chat.js";

// Importamos las rutas.
import usersRoutes from "./routes/users_routes.js";
import entriesRoutes from "./routes/entries_routes.js";
import chatRoutes from "./routes/chat_routes.js";

// Importamos las funciones controladoras de los errores.
import notFoundController from "./middlewares/not_found_controller.js";
import errorController from "./middlewares/error_controller.js";

// Creamos el servidor con Express.
const app = express();

// Creamos el servidor para el chat.
const server = http.createServer(app);
const io = chatConfig(server);

// Middleware que evita problemas de conexión con el cliente.
app.use(cors());

// Middleware que permite leer un body en formato "raw".
app.use(express.json());

// Middleware que permite leer un body en formato "form-data".
app.use(fileUpload());

// Middleware que muestra información por consola de la petición entrante.
app.use(morgan("dev"));

// Middleware que indica a Express dónde están las rutas con ficheros estáticos.
app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/videos", express.static(VIDEO_DIR));

// Middleware que indica a Express donde están las rutas.
app.use("/users", usersRoutes);
app.use("/entries", entriesRoutes);
app.use("/chat", chatRoutes);

// Middleware de ruta no encontrada y middleware de error.
app.use(notFoundController);
app.use(errorController);

// Middleware que indica a Express cuál es el puerto en el que debe funcionar.
app.listen(PORT, () => {
  console.log(
    `Server running at: http://localhost:${PORT}. Press Ctrl-C to terminate.`
  );
});
