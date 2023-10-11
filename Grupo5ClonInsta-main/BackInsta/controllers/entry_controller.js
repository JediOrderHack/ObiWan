// Importamos las funciones que me permiten conectarme a la base de datos.
import {
  getEntryBy,
  insertEntryQuery,
  updateEntry,
  addLike,
  removeLike,
  insertPhotoQuery,
  destroyPhoto,
  getPhotoById,
  getAllEntriesWithLikes,
  getLikesCount,
  selectEntryByIdQuery,
  getEntriesWithLikesAndPhotosByDescription,
  insertComment,
  deleteCommentById,
  getEntryById,
  getCommentById,
  insertVideo,
  checkVideoLimit,
  getVideoById,
  destroyVideo,
  selectAllEntriesQuery,
} from "../db/queries/entries_queries.js";

import Joi from "joi";

// Services
import { saveImage, deletePhoto } from "../services/photos.js";
import saveVideo from "../services/videos.js";
// Config
import {
  MAX_ENTRY_IMAGE_SIZE,
  VIDEO_DIR,
  MAX_VIDEO_DURATION,
  MAX_VIDEO_SIZE,
} from "../config.js";

// Errors
import NotFoundError from "../errors/not_found_error.js";
import ContentError from "../errors/content_error.js";
import AuthError from "../errors/auth_error.js";

import getPool from "../db/pool.js";

import notFoundController from "../middlewares/not_found_controller.js";
import EntryNotFound from "../errors/not-found-entry.js";

// Importamos los esquemas de Joi.
import createEntrySchema from "../schemas/entries/createEntrySchema.js";

// Importamos la función que valida esquemas.
import validateSchema from "../helpers/validate_schema.js";

// Función controladora final que inserta una entrada.
async function createEntryController(req, res, next) {
  try {
    // Obtenemos los datos necesarios del body.
    const { description } = req.body;

    // Obtenemos el id del usuario que creará la entrada.
    const { id: userId } = req.user;

    // Validamos los datos que envía el usuari con Joi.
    await validateSchema(createEntrySchema, {
      ...req.body,
      ...req.files,
    });

    // Insertamos la entrada en la DB y obtenemos su ID.
    const entryId = await insertEntryQuery({ description, userId });

    // Array donde almacenaremos las fotos.
    const photos = [];

    // Recorremos las fotos. Utilizamos Object.values para generar un array con las fotos que haya en req.files.
    for (const photo of Object.values(req.files)) {
      // Guardamos la foto en el disco y obtenemos su nombre.
      const photoName = await saveImage({
        img: photo,
        width: MAX_ENTRY_IMAGE_SIZE,
      });

      // Insertamos la foto y obtenemos el ID.
      const photoId = await insertPhotoQuery({
        photoName,
        entryId,
      });

      // Pusheamos la foto al array de fotos.
      photos.push({
        id: photoId,
        photoName,
      });
    }

    res.send({
      status: "ok",
      data: {
        entry: {
          id: entryId,
          description,
          photos,
          createdAt: new Date(),
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

// Función controladora final que lista las entradas.
async function listEntriesController(req, res, next) {
  try {
    const entries = await selectAllEntriesQuery({ userId: req.user?.id || 0 });

    res.send({
      status: "ok",
      data: {
        entries,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Función controladora final que retorna una entrada concreta.
const getEntryController = async (req, res, next) => {
  try {
    // Obtenemos el id de la entrada de los path params.
    const { id: entryId } = req.params;

    const entry = await selectEntryByIdQuery({
      entryId,
      userId: req.user?.id || 0,
    });

    res.send({
      status: "ok",
      data: {
        entry,
      },
    });
  } catch (err) {
    next(err);
  }
};

async function editEntry(req, res, next) {
  try {
    // Define esquemas Joi para validar el parámetro de ruta 'id' y el cuerpo de la solicitud 'req.body'
    const paramsSchema = Joi.object({
      id: Joi.number().integer().min(1).required(),
    });

    const bodySchema = Joi.object({
      description: Joi.string().max(1000).required(),
      // Agrega aquí las validaciones para otros campos si es necesario.
    });

    // Validar el parámetro de ruta 'id' utilizando el esquema Joi
    const { id } = await paramsSchema.validateAsync(req.params);
    const userId = req.user?.id;

    // Validar el cuerpo de la solicitud 'req.body' utilizando el esquema Joi
    const editedEntryData = await bodySchema.validateAsync(req.body);

    // Buscar la entrada original
    const originalEntry = await getEntryBy({ id, userId });

    if (!originalEntry) {
      // La entrada no existe
      console.log("No existe la entrada que deseas editar.");
      return res.status(404).json({
        status: "error",
        message: "No existe la entrada que deseas editar.",
      });
    }
    // Revisa si la entrada le pertenece al usuario logueado
    if (!originalEntry.owner)
      throw new AuthError({
        message: "No tienes suficientes permisos",
        status: 401,
      });

    // Combina los datos originales con los datos editados
    const editedEntry = {
      ...originalEntry,
      ...editedEntryData,
    };

    const photos = [];

    if (req.files) {
      const currentPhotosLength = originalEntry.photos.length;
      const availablePhotoSpaces = 3 - currentPhotosLength;
      if (availablePhotoSpaces === 0)
        throw new ContentError({
          message:
            "Tienes el número máximo de fotos, para agregar una debes eliminar una",
          status: 400,
        });

      const currentPhotos = Array.isArray(req.files.photo)
        ? req.files.photo
        : [req.files.photo];

      for (const photo of currentPhotos) {
        try {
          if (!photo || !photo.data) {
            console.error("Datos de imagen faltantes o inválidos");
            continue; // Salta esta imagen y continúa con la siguiente.
          }

          // Guardamos la foto en el disco.
          const photoName = await saveImage({
            images: [photo], // Envía la imagen como parte de un array
            width: MAX_ENTRY_IMAGE_SIZE,
          });

          // Insertamos la foto y obtenemos los datos de la misma.
          const newPhoto = await insertPhotoQuery({
            photoName,
            entryId: editedEntry.id,
          });
          if (newPhoto instanceof Error) throw newPhoto;

          // Pusheamos la foto al array de fotos.
          photos.push(newPhoto);
        } catch (error) {
          console.error("Error al procesar imagen:", error);
        }
      }
    }

    // Actualiza la entrada utilizando los datos editados
    const updatedEntry = await updateEntry(editedEntry);
    if (updatedEntry instanceof Error) throw updatedEntry;

    res.send({
      status: "ok",
      message: "Entrada actualizada",
      data: {
        entry: updatedEntry,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function addPhoto(req, res, next) {
  try {
    const paramsSchema = Joi.object({
      id: Joi.number().integer().min(1).required(),
    });

    const { id } = await paramsSchema.validateAsync(req.params);
    const { id: userId } = req.user;

    if (!req.files?.photo) {
      const errorMessage = "Faltan campos en la solicitud.";
      console.log(errorMessage);
      throw new ContentError({ message: errorMessage, status: 400 });
    }

    const entry = await getEntryBy({ id, userId });

    if (entry instanceof Error) throw entry;
    if (!entry) {
      const errorMessage = "Entrada no encontrada.";
      console.log(errorMessage);
      throw new EntryNotFound({ message: errorMessage, status: 404 });
    }

    // Verificar si hay fotos y limitar su cantidad
    if (entry.photos && entry.photos.length >= 3) {
      console.log("Límite de tres fotos alcanzado.");
      throw new ContentError({
        message: "Límite de tres fotos alcanzado",
        status: 418,
      });
    }

    const currentPhotos = Array.isArray(req.files.photo)
      ? req.files.photo
      : [req.files.photo];

    const photos = [];

    for (const photo of currentPhotos) {
      try {
        // Guardamos la foto en el disco.
        const photoName = await saveImage({
          images: [photo], // Envía la imagen como parte de un array
          width: MAX_ENTRY_IMAGE_SIZE,
        });

        // Insertamos la foto y obtenemos los datos de la misma.
        const newPhoto = await insertPhotoQuery({ photoName, entryId: id });
        if (newPhoto instanceof Error) throw newPhoto;

        photos.push(newPhoto);
      } catch (error) {
        console.error("Error al procesar imagen:", error);
      }
    }

    console.log("Imágenes agregadas con éxito.");
    res.send({
      status: "ok",
      data: {
        photos,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function deleteEntryPhoto(req, res, next) {
  try {
    console.log("Solicitud de eliminación de foto recibida");

    const paramsSchema = Joi.object({
      id: Joi.number().integer().min(1).required(),
      photoId: Joi.number().integer().min(1).required(),
    });

    console.log("Parámetros de ruta:", req.params);

    const { id, photoId } = await paramsSchema.validateAsync(req.params);
    const { id: userId } = req.user;

    console.log("Usuario actual:", req.user);

    // Verificar si la foto con el photoId proporcionado existe en la base de datos
    const existingPhoto = await getPhotoById(photoId);

    if (!existingPhoto) {
      console.log("No existe la foto que desea borrar.");
      return res.status(404).send({
        status: "error",
        message: "No existe la foto que desea borrar.",
      });
    }

    // La foto existe, así que procedemos a eliminarla
    await destroyPhoto({ id: photoId });

    console.log("Foto eliminada con éxito. Respuesta enviada.");

    res.send({
      status: "ok",
      message: "Foto eliminada",
    });
  } catch (err) {
    console.error("Error en la función deleteEntryPhoto:", err);
    next(err);
  }
}

async function addLikeController(req, res, next) {
  try {
    // Obtener el id de los params
    const { entryId } = req.params;

    // Llama a la función para dar like.
    const result = await addLike({ entryId, userId: req.user.id });

    res.json({
      status: "ok",
      message: result,
    });
  } catch (error) {
    next(error);
  }
}

async function removeLikeController(req, res, next) {
  try {
    // Validar los datos de entrada utilizando el esquema Joi
    const { entryId } = req.params;

    // Llama a la función para eliminar el like.
    const result = await removeLike({ entryId, userId: req.user.id });

    res.json({
      status: "ok",
      message: result,
    });
  } catch (error) {
    next(error);
  }
}

const searchEntriesByDescription = async (req, res) => {
  try {
    const { description } = req.query; // Obtén la descripción de los parámetros de consulta

    // Llama a la función getEntriesWithLikesAndPhotos con la descripción como parámetro
    const entries = await getEntriesWithLikesAndPhotosByDescription(
      description
    );

    if (!entries) {
      res
        .status(404)
        .json({ error: "No se encontraron entradas con esa descripción." });
    } else {
      res.status(200).json(entries);
    }
  } catch (error) {
    console.error("Error en searchEntriesByDescription:", error);
    res.status(500).json({ error: "Error al buscar las entradas." });
  }
};

// Controlador para agregar un comentario a una entrada
async function addComment(req, res, next) {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const { commentText } = req.body;

    // Validar que el comentario no esté vacío
    if (!commentText) {
      return res.status(400).json({
        status: "error",
        message: "El comentario no puede estar vacío.",
      });
    }

    // Comprobar si la entrada existe
    const entry = await getEntryById(id);
    if (!entry) {
      return res.status(404).json({
        status: "error",
        message: "La entrada no existe.",
      });
    }

    // Insertar el comentario en la base de datos
    const newComment = await insertComment({
      entryId: id,
      userId,
      commentText,
    });

    res.json({
      status: "ok",
      data: {
        comment: newComment,
      },
    });
  } catch (error) {
    console.error("Error en addComment:", error);
    next(error);
  }
}

// Controlador para borrar un comentario de una entrada
async function deleteComment(req, res, next) {
  try {
    const { id, commentId } = req.params;

    // Comprobar si la entrada existe
    const entry = await getEntryById(id);
    if (!entry) {
      return res.status(404).json({
        status: "error",
        message: "La entrada no existe.",
      });
    }

    // Comprobar si el comentario existe
    const comment = await getCommentById(commentId);
    if (!comment) {
      return res.status(404).json({
        status: "error",
        message: "El comentario no existe.",
      });
    }

    // Comprobar si el usuario logueado es el propietario del comentario
    if (comment.userId !== req.user.id) {
      return res.status(401).json({
        status: "error",
        message: "No tienes permiso para eliminar este comentario.",
      });
    }

    // Eliminar el comentario de la base de datos
    const deletedComment = await deleteCommentById(commentId);

    if (!deletedComment) {
      return res.status(404).json({
        status: "error",
        message: "El comentario no pudo ser eliminado.",
      });
    }

    res.json({
      status: "ok",
      message: "Comentario eliminado.",
    });
  } catch (error) {
    console.error("Error en deleteComment:", error);
    next(error);
  }
}

async function addVideo(req, res, next) {
  console.log("Recibida la solicitud para subir un video");
  try {
    const paramsSchema = Joi.object({
      id: Joi.number().integer().min(1).required(),
    });

    const { id } = await paramsSchema.validateAsync(req.params);
    const { id: userId } = req.user;

    if (!req.files?.video) {
      const errorMessage = "Faltan campos en la solicitud.";
      console.log(errorMessage);
      throw new ContentError({ message: errorMessage, status: 400 });
    }

    const entry = await getEntryBy({ id, userId });

    if (entry instanceof Error) throw entry;
    if (!entry) {
      const errorMessage = "Entrada no encontrada.";
      console.log(errorMessage);
      throw new NotFoundError({ message: errorMessage, status: 404 });
    }

    // Usar la función checkVideoLimit para verificar si se ha alcanzado el límite de videos
    const videoLimitReached = await checkVideoLimit(id);

    if (videoLimitReached) {
      console.log("Limite de un video alcanzado.");
      throw new ContentError({
        message: "Limite de un video alcanzado",
        status: 418,
      });
    }

    const currentVideos = Array.isArray(req.files.video)
      ? req.files.video
      : [req.files.video];

    const videos = [];

    for (const video of currentVideos) {
      try {
        console.log("Datos salientes a saveVideo:", video);
        // Guardamos la foto en el disco.
        const videoName = await saveVideo(video, video.name); // Pasamos req y res como argumentos
        if (videoName instanceof Error) throw videoName;

        // Insertamos la foto y obtenemos los datos de la misma.
        console.log("Datos de videoName:", videoName);
        const newVideo = await insertVideo({ videoName, entryId: id });
        if (newVideo instanceof Error) throw newVideo;

        videos.push(newVideo);
      } catch (error) {
        next(error); // Enviar el error al manejador de errores
        return; // Salir de la función para evitar la respuesta 200 incorrecta
      }
    }

    res.send({
      status: "ok",
      data: {
        videos,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function deleteEntryVideo(req, res, next) {
  try {
    console.log("Solicitud de eliminación de video recibida");

    const paramsSchema = Joi.object({
      id: Joi.number().integer().min(1).required(),
      videoId: Joi.number().integer().min(1).required(),
    });

    console.log("Parámetros de ruta:", req.params);

    const { id, videoId } = await paramsSchema.validateAsync(req.params);
    const { id: userId } = req.user;

    console.log("Usuario actual:", req.user);

    // Verificar si la foto con el photoId proporcionado existe en la base de datos
    const existingVideo = await getVideoById(videoId);

    if (!existingVideo) {
      console.log("No existe el video que desea borrar.");
      return res.status(404).send({
        status: "error",
        message: "No existe el video que desea borrar.",
      });
    }

    // La foto existe, así que procedemos a eliminarla
    await destroyVideo({ id: videoId });

    console.log("Video eliminado con éxito. Respuesta enviada.");

    res.send({
      status: "ok",
      message: "Video Eliminado",
    });
  } catch (err) {
    console.error("Error en la función deleteEntryPhoto:", err);
    next(err);
  }
}

export {
  createEntryController,
  listEntriesController,
  getEntryController,
  editEntry,
  addPhoto,
  deleteEntryPhoto,
  addLikeController,
  removeLikeController,
  searchEntriesByDescription,
  addComment,
  deleteComment,
  addVideo,
  deleteEntryVideo,
};
