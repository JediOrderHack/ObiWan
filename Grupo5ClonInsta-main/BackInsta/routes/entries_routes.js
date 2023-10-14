// Importamos Express y creamos un Router.
import express from "express";
const router = express.Router();

// Importamos las funciones controladoras intermedias.
import authUserController from "../middlewares/auth_user_controller.js";
import userExistsController from "../middlewares/user_exists_controller.js";
import authUserOptionalController from "../middlewares/auth_user_optional_controller.js";

// Importamos las funciones controladoras finales.
import {
  createEntryController,
  listEntriesController,
  getEntryController,
  editEntryController,
  addLikeController,
  removeLikeController,
  checkEntryLikeController
} from "../controllers/entry_controller.js";

// Crear una entrada.
router.post(
  "/",
  authUserController,
  userExistsController,
  createEntryController
);

// Obtener todas las entradas.
router.get("/", authUserOptionalController, listEntriesController);

// Obtener una sola entrada.
router.get("/:id", authUserOptionalController, getEntryController);

// Editar una entrada.
router.put(
  "/:id",
  authUserController,
  userExistsController,
  editEntryController
);

// Dar like.
router.post(
  "/:entryId/likes",
  authUserController,
  userExistsController,
  addLikeController
);

// Eliminar like.
router.delete(
  "/:entryId/likes",
  authUserController,
  userExistsController,
  removeLikeController
);

// saber si le he dado like.
router.get(
  "/:entryId/likes",
  authUserController,
  checkEntryLikeController
)

export default router;
