import express from "express";

//Middlewares
import authUserController from "../middlewares/auth_user_controller.js";
import userExistsController from "../middlewares/user_exists_controller.js";

//Controllers
import * as chatController from "../controllers/chat_controller.js";

const router = express.Router();

//Routes

//Crear sala
router.post(
  "/create-room",
  authUserController,
  userExistsController,
  chatController.createRoom
);

// Modifica la ruta para incluir el identificador de la sala
router.post(
  "/:id/send-message",
  authUserController,
  userExistsController,
  chatController.sendChatMessage
);

router.get(
  "/:id/messages",
  authUserController,
  userExistsController,
  chatController.getMessages
);

export default router;
