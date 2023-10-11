import express from "express";
import multer from "multer";
import { VIDEO_DIR } from "../config.js";
// Middlewares
import authUserController from "../middlewares/auth_user_controller.js";
import userExistsController from "../middlewares/user_exists_controller.js";
import authUserOptionalController from "../middlewares/auth_user_optional_controller.js";

// Controllers
import * as entryController from "../controllers/entry_controller.js";

// Importamos las funciones controladoras finales.
import {
  createEntryController,
  listEntriesController,
  getEntryController,
} from "../controllers/entry_controller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, VIDEO_DIR);
  },
  filename: function (req, file, cb) {
    const videoName = Date.now() + "-" + file.originalname;
    cb(null, videoName);
  },
});

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

// Rutas para dar y eliminar likes
router.post(
  "/:entryId/likes/add",
  authUserController,
  userExistsController,
  entryController.addLikeController
);
router.post(
  "/:entryId/likes/remove",
  authUserController,
  userExistsController,
  entryController.removeLikeController
);

// Nueva ruta para obtener entradas por descripción
// GET /entries/description?description=<descripción>
router.get("/description", entryController.searchEntriesByDescription);

// PUT /entries/1
router.put(
  "/:id",
  authUserController,
  userExistsController,
  entryController.editEntry
);
router.patch(
  "/:id",
  authUserController,
  userExistsController,
  entryController.editEntry
);

// Agregar imágenes al post
// POST /entries/1/photos
router.post(
  "/:id/photos",
  authUserController,
  userExistsController,
  entryController.addPhoto
);

// Borrar una foto
// DELETE /entries/4/photos/9
router.delete(
  "/:id/photos/:photoId",
  authUserController,
  userExistsController,
  entryController.deleteEntryPhoto
);

// Agregar comentario a una entrada
// POST /entries/1/comments
router.post(
  "/:id/comments",
  authUserController,
  userExistsController,
  entryController.addComment
);

// Borrar un comentario de una entrada
// DELETE /entries/1/comments/2
router.delete(
  "/:id/comments/:commentId",
  authUserController,
  userExistsController,
  entryController.deleteComment
);

// Ruta para la subida de videos
// POST /entries/1/videos
router.post(
  "/:id/videos",
  authUserController,
  userExistsController,
  entryController.addVideo
);

// Ruta para borrar videos
// DELETE /entries/4/videos/1
router.delete(
  "/:id/videos/:videoId",
  authUserController,
  userExistsController,
  (req, res, next) => {
    console.log("Datos recibidos en la ruta de eliminación de video:");
    console.log("Entry ID:", req.params.id);
    console.log("Video ID:", req.params.videoId);
    entryController.deleteEntryVideo(req, res, next); // Llama a tu controlador
  }
);

export default router;
