// Importamos Express y creamos Router.
import express from "express";
const router = express.Router();

// Controllers
import * as userController from "../controllers/user_controller.js";

// Funciones controladoras intermedias.
import authUserController from "../middlewares/auth_user_controller.js";
import authUserOptionalController from "../middlewares/auth_user_optional_controller.js";
import userExistsController from "../middlewares/user_exists_controller.js";

// Importamos las funciones controladoras finales.
import {
  createUserController,
  validateUserController,
  loginUserController,
  getUserPrivateProfileController,
  getUserPublicProfileController,
} from "../controllers/user_controller.js";

// Crear usuario.
router.post("/", createUserController);

// Validar usuario.
router.put("/validate/:regCode", validateUserController);

// Login de usuario.
router.post("/login", loginUserController);

// Obtener perfil privado de un usuario.
router.get(
  "/",
  authUserController,
  userExistsController,
  getUserPrivateProfileController
);

// Obtener perfil público de un usuario con sus fotos.
router.get("/:id", authUserOptionalController, getUserPublicProfileController);

// Actualizar avatar de usuario.
router.put(
  "/avatar",
  authUserController,
  userExistsController,
  userController.editUserAvatar
);

// PUT /users/recover-password
router.put("/recover-password", userController.sendRecoverPass);

// PUT /users/reset-password
router.put("/reset-password", userController.editUserPass);

export default router;
