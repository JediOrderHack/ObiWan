import express from 'express';
import multer from 'multer';
import { VIDEO_DIR } from "../config.js";
// Middlewares
import authUser from '../middlewares/auth_user.js';
import userExists from '../middlewares/user_exists.js';
import authUserOptional from '../middlewares/auth_user_optional.js';

// Controllers
import * as entryController from '../controllers/entry_controller.js';

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


// Routes


// Obtener todas las fotos
// GET /entries/photos
router.get('/photos', entryController.getAllPhotosController);

// Rutas para dar y eliminar likes
router.post('/:entryId/likes/add', authUser, userExists, entryController.addLikeController);
router.post('/:entryId/likes/remove', authUser, userExists, entryController.removeLikeController);


// Crear una entrada
// POST /entries/
router.post('/', authUser, userExists, entryController.createEntry);

// Nueva ruta para obtener entradas por descripción
// GET /entries/description?description=<descripción>
router.get('/description', entryController.searchEntriesByDescription);

// Obtener todas las entradas
// GET /entries/
router.get('/', entryController.listEntries);

// Obtener una sola entrada
// GET /entries/1
router.get('/:id', entryController.getEntry);

// Ruta para verificar si un usuario ha dado "like" en una entrada
router.get('/:entryId/likes/check', authUser, userExists, entryController.hasLikedEntryController);

// PUT /entries/1
router.put('/:id', authUser, userExists, entryController.editEntry);
router.patch('/:id', authUser, userExists, entryController.editEntry);

// Agregar imágenes al post
// POST /entries/1/photos
router.post('/:id/photos', authUser, userExists, entryController.addPhoto);

// Borrar una foto
// DELETE /entries/4/photos/9
router.delete('/:id/photos/:photoId', authUser, userExists, entryController.deleteEntryPhoto);

// Agregar comentario a una entrada
// POST /entries/1/comments
router.post('/:id/comments', authUser, userExists, entryController.addComment);

// Borrar un comentario de una entrada
// DELETE /entries/1/comments/2
router.delete('/:id/comments/:commentId', authUser, userExists, entryController.deleteComment);

// Ruta para la subida de videos
// POST /entries/1/videos
router.post("/:id/videos", authUser, userExists, entryController.addVideo);

// Ruta para borrar videos
// DELETE /entries/4/videos/1
router.delete("/:id/videos/:videoId", authUser, userExists, (req, res, next) => {
  console.log("Datos recibidos en la ruta de eliminación de video:");
  console.log("Entry ID:", req.params.id);
  console.log("Video ID:", req.params.videoId);
  entryController.deleteEntryVideo(req, res, next); // Llama a tu controlador
});

export default router