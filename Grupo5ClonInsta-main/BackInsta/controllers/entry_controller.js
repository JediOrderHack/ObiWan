import {
  getEntryBy,
  newEntry,
  updateEntry,
  addLike,
  removeLike,
  insertPhoto,
  destroyPhoto,
  getPhotoById,
  getAllEntriesWithLikes,
  getLikesCount,
  getEntryWithLikesAndPhotos,
  getEntriesWithLikesAndPhotosByDescription,
  insertComment,
  deleteCommentById,
  getEntryById,
  getCommentById,
  insertVideo,
  checkVideoLimit,
  getVideoById,
  destroyVideo,
  getAllEntries,
  getAllPhotos,
} from "../db/queries/entries_queries.js"

import ffmpeg from 'fluent-ffmpeg'
import fs from "fs";
import Joi from "joi";
// Services
import { savePhoto, deletePhoto } from "../services/photos.js";
import saveVideo from "../services/videos.js";
// Config
import { maxImageSize, VIDEO_DIR , MAX_VIDEO_DURATION, MAX_VIDEO_SIZE} from "../config.js";

// Errors
import NotFoundError from "../errors/not_found_error.js";
import ContentError from "../errors/content_error.js";
import AuthError from "../errors/auth_error.js";

import getPool from "../db/pool.js";

import error404 from "../middlewares/error404.js";
import EntryNotFound from "../errors/not-found-entry.js";



async function createEntry(req, res, next) {
  try {
    const { description } = req.body;
    const { id: userId } = req.user;

    // Define un esquema de validación con Joi
    const schema = Joi.object({
      description: Joi.string().required(),
    });

    // Valida los datos de entrada con Joi
    const { error } = schema.validate({ description });

    if (error) {
      throw new Error(error.details[0].message);
    }

    // Agrega un console.log para verificar los datos de las imágenes en req.files
    console.log("Imágenes en req.files:", req.files);

    // Insertar entry en db
    const entry = await newEntry({ description, userId, photo: "", video: "" });

    if (entry instanceof Error) throw entry;

    const photos = [];

    if (req.files) {
      const reqPhotos = Array.isArray(req.files.photo)
        ? req.files.photo
        : [req.files.photo];

      for (const photo of reqPhotos) {
        try {
          if (!photo || !photo.data) {
            console.error("Datos de imagen faltantes o inválidos");
            continue; // Salta esta imagen y continúa con la siguiente.
          }
          // Agrega un console.log para verificar los datos de la imagen antes de guardarla
          console.log("Datos de la imagen:", photo);

          // Guardamos la foto en el disco.
          const photoName = await savePhoto({
            images: [photo], // Envía la imagen como parte de un array
            width: maxImageSize,
          });

          // Insertamos la foto y obtenemos los datos de la misma.
          const newPhoto = await insertPhoto({
            photoName,
            entryId: entry.id,
            photo: photoName,
          });

          if (newPhoto instanceof Error) throw newPhoto;

          // Pusheamos la foto al array de fotos.
          photos.push(newPhoto);

          // Agrega un console.log para verificar que la imagen se haya guardado correctamente
          console.log("Imagen guardada:", photoName);
        } catch (error) {
          // Agrega un console.error para registrar errores relacionados con las imágenes
          console.error("Error al procesar imagen:", error);
        }
      }
    }

    // Lógica para manejar videos
    const videos = [];
    if (req.files) {
      const reqVideos = Array.isArray(req.files.video)
        ? req.files.video
        : [req.files.video];

      for (const video of reqVideos) {
        try {
          if (!video || !video.data) {
            console.error("Datos de video faltantes o inválidos");
            continue;
          }

          // Guarda el video en el disco utilizando la función saveVideo
          const videoName = await saveVideo(video, video.name);
          if (videoName instanceof Error) throw videoName;

          // Inserta el video y obtén los datos del mismo
          const newVideo = await insertVideo({ videoName, entryId: entry.id });
          if (newVideo instanceof Error) throw newVideo;

          // Agrega el video al array de videos
          videos.push(newVideo);
        } catch (error) {
          // Agrega un console.error para registrar errores relacionados con los videos
          console.error("Error al procesar video:", error);
        }
      }
    }

    res.send({
      status: "ok",
      data: {
        entry: {
          ...entry,
          photos,
          videos,
        },
      },
    });
  } catch (error) {
    console.error("Error al procesar imagen o video:", error);
  }
}

// async function createEntry (req, res, next) {
//   try {
//     const { title, place, description } = req.body
//     const { id: userId } = req.user

//     // Validar que datos obligatorios sean entregados
//     if (!title) throw new ValidationError({ message: 'El campo title es obligatorio', field: 'title' })
//     if (!place) throw new ValidationError({ message: 'El campo place es obligatorio', field: 'place' })
//     if (!description) throw new ValidationError({ message: 'El campo description es obligatorio', field: 'description' })

//     // Insertar entry en db
//     const entry = await newEntry({ title, place, description, userId })
//     if (entry instanceof Error) throw entry

//     const photos = []
//     if (req.files) {
//       const reqPhotos = Object.values(req.files).slice(0, 3)
//       for (const photo of reqPhotos) {
//         // Guardamos la foto en el disco.
//         const photoName = await savePhoto({ img: photo, width: maxImageSize })

//         // Insertamos la foto y obtenemos los datos de la misma.
//         const newPhoto = await insertPhoto({ photoName, entryId: entry.id })
//         if (newPhoto instanceof Error) throw newPhoto

//         // Pusheamos la foto al array de fotos.
//         photos.push(newPhoto)
//       }
//     }

//     res.send({
//       status: 'ok',
//       data: {
//         entry: {
//           ...entry,
//           photos
//         }
//       }
//     })
//   } catch (error) {
//     next(error)
//   }
// }


// async function createEntry (req, res, next) {
//   try {
//     const { description } = req.body
//     const { id: userId } = req.user

//     // Validar que datos obligatorios sean entregados
//     if (!) throw new ValidationError({ message: 'El campo  es obligatorio', field: '' })
//     if () throw new ValidationError({ message: 'El campo es obligatorio', field: ' })
//     if (!description) throw new ValidationError({ message: 'El campo description es obligatorio', field: 'description' })

//     // Insertar entry en db
//     const entry = await newEntry({ ,, description, userId })
//     if (entry instanceof Error) throw entry

//     const photos = []
//     if (req.files) {
//       const reqPhotos = Object.values(req.files).slice(0, 3)
//       for (const photo of reqPhotos) {
//         // Guardamos la foto en el disco.
//         const photoName = await savePhoto({ img: photo, width: maxImageSize })

//         // Insertamos la foto y obtenemos los datos de la misma.
//         const newPhoto = await insertPhoto({ photoName, entryId: entry.id })
//         if (newPhoto instanceof Error) throw newPhoto

//         // Pusheamos la foto al array de fotos.
//         photos.push(newPhoto)
//       }
//     }

//     res.send({
//       status: 'ok',
//       data: {
//         entry: {
//           ...entry,
//           photos
//         }
//       }
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// Controlador para verificar si un usuario ha dado "like" en una entrada específica

async function hasLikedEntryController(req, res, next) {
  try {
    // Obtener el id de la entrada (entryId) de los parámetros de la solicitud
    const { entryId } = req.params;
    // Obtener el id del usuario (userId) de la solicitud actual
    const userId = req.user.id;

    // Realizar la consulta SQL para verificar si el usuario ha dado "me gusta"
    const connection = await getPool();
    const [result] = await connection.query(
      `
      SELECT EXISTS(
        SELECT 1
        FROM likes
        WHERE user_id = ? AND post_id = ?
      ) AS hasLiked;
      `,
      [userId, entryId]
    );

    // El resultado será un objeto con una propiedad "hasLiked" que será 1 si ha dado "me gusta" o 0 si no ha dado "me gusta"
    const hasLiked = result[0].hasLiked === 1;

    res.json({
      status: "ok",
      hasLiked: hasLiked,
    });
  } catch (error) {
    next(error);
  }
}

// Controlador para listar todas las entradas
async function listEntries(req, res, next) {
  try {
    const entries = await getAllEntries();
    res.json({ entries });
    console.log(entries)
  } catch (err) {
    next(err);
  }
}


// async function listEntries (req, res, next) {
//   try {
//     const { keyword } = req.query

//     // Dado que la propiedad user puede no existir lo indicamos por medio de la interrogación.
//     const entries = await getAllEntries({ keyword, userId: req.user?.id })
//     if (entries instanceof Error) throw entries

//     res.send({
//       status: 'ok',
//       data: {
//         entries
//       }
//     })
//   } catch (err) {
//     next(err)
//   }
// }

const getAllPhotosController = async (req, res) => {
  try {
    const photos = await getAllPhotos(); // Llama a la función para obtener todas las fotos
    res.json(photos);
  } catch (error) {
    console.error("Error al obtener las fotos:", error);
    res.status(500).json({ error: "Error al obtener las fotos" });
  }
};


// Controlador para obtener una sola entrada
const getEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await getEntryWithLikesAndPhotos(id);
    if (!entry) {
      res.status(404).json({ error: "Entrada no encontrada." });
    } else {
      // Elimina el campo userId de la entrada antes de enviar la respuesta
      delete entry.userId;

      res.status(200).json(entry);
    }
  } catch (error) {
    console.error("Error en getEntry:", error);
    res.status(500).json({ error: "Error al obtener la entrada." });
  }
};


// // Función para obtener una sola entrada con el número de "likes"
// const getEntryWithLikes = async (entryId, userId) => {
//   const entry = await getEntryBy({ id: entryId, userId });

//   if (!entry) {
//     return null;
//   }

//   const likesCount = await getLikesCount(entryId);
//   return { ...entry, likes: likesCount };
// };

// Función para obtener el número de "likes" para una entrada específica

// async function getEntry (req, res, next) {
//   try {
//     const { id } = req.params
//     const userId = req.user?.id

//     const entry = await getEntryBy({ id, userId })
//     if (entry instanceof Error) throw entry

//     res.send({
//       status: 'ok',
//       data: {
//         entry
//       }
//     })
//   } catch (err) {
//     next(err)
//   }
// }

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
          const photoName = await savePhoto({
            images: [photo], // Envía la imagen como parte de un array
            width: maxImageSize,
          });

          // Insertamos la foto y obtenemos los datos de la misma.
          const newPhoto = await insertPhoto({
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

// async function editEntry (req, res, next) {
//   try {
//     const { id } = req.params
//     const userId = req.user?.id

//     // Revisa si la entrada existe
//     const originalEntry = await getEntryBy({ id, userId })
//     if (originalEntry instanceof Error) throw originalEntry

//     // Revisa si la entrada le pertenece al usuario logueado
//     if (!originalEntry.owner) throw new AuthError({ message: 'No tienes suficientes permisos', status: 401 })

//     const editedEntry = {
//       ...originalEntry,
//       ...req.body
//     }

//     const photos = []

//     if (req.files) {
//       const currentPhotosLength = originalEntry.photos.length
//       const availablePhotoSpaces = 3 - currentPhotosLength
//       if (availablePhotoSpaces === 0) throw new ContentError({ message: 'Tienes el número máximo de fotos, para agregar una debes eliminar una', status: 400 })

//       const currentPhotos = Object.values(req.files).slice(0, availablePhotoSpaces)

//       for (const photo of currentPhotos) {
//         // Guardamos la foto en el disco.
//         const photoName = await savePhoto({ img: photo, width: maxImageSize })

//         // Insertamos la foto y obtenemos los datos de la misma.
//         const newPhoto = await insertPhoto({ photoName, entryId: editedEntry.id })
//         if (newPhoto instanceof Error) throw newPhoto

//         // Pusheamos la foto al array de fotos.
//         photos.push(newPhoto)
//       }
//     }

//     const updatedEntry = await updateEntry(editedEntry)
//     if (updatedEntry instanceof Error) throw updatedEntry

//     res.send({
//       status: 'ok',
//       message: 'Entrada actualizada',
//       data: {
//         entry: updatedEntry
//       }
//     })
//   } catch (err) {
//     next(err)
//   }
// }
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
        const photoName = await savePhoto({
          images: [photo], // Envía la imagen como parte de un array
          width: maxImageSize,
        });

        // Insertamos la foto y obtenemos los datos de la misma.
        const newPhoto = await insertPhoto({ photoName, entryId: id });
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


// async function addPhoto (req, res, next) {
//   try {
//     const { id } = req.params
//     const { id: userId } = req.user

//     // Si no hay foto lanzamos un error.
//     if (!req.files?.photo) throw new ContentError({ message: 'Faltan campos', status: 400 })

//     const entry = await getEntryBy({ id, userId })
//     if (entry instanceof Error) throw entry

//     // Si no somos los dueños de la entrada lanzamos un error.
//     if (!entry.owner) throw new AuthError({ message: 'No tienes suficientes permisos', status: 401 })

//     // Si la entrada ya tiene tres fotos lanzamos un error.
//     if (entry.photos.length > 2) throw new ContentError({ message: 'Límite de tres fotos alcanzado', status: 418 })

//     // Guardamos la foto en la carpeta uploads y obtenemos el nombre que le hemos dado.
//     const photoName = await savePhoto({ img: req.files.photo, width: maxImageSize })

//     // Guardamos la foto en la base de datos.
//     const photo = await insertPhoto({ photoName, entryId: id })
//     if (photo instanceof Error) throw photo

//     res.send({
//       status: 'ok',
//       data: {
//         photo: {
//           ...photo,
//           entryId: Number(entry.id)
//         }
//       }
//     })
//   } catch (err) {
//     next(err)
//   }
// }


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


// async function deleteEntryPhoto (req, res, next) {
//   try {
//     const { id, photoId } = req.params
//     const { id: userId } = req.user

//     const entry = await getEntryBy({ id, userId })
//     if (entry instanceof Error) throw entry

//     // Si no somos los dueños de la entrada lanzamos un error.
//     if (!entry.owner) throw new AuthError({ message: 'No tienes suficientes permisos', status: 401 })

//     // Localizamos la foto en el array de fotos de la entrada.
//     const photo = entry.photos.find((photo) => photo.id === Number(photoId))

//     // Si no hay foto lanzamos un error.
//     if (!photo) throw new ContentError({ message: 'Foto no encontrada', status: 404 })

//     // Borramos la foto de la carpeta uploads.
//     const deletedPhoto = await deletePhoto({ name: photo.name })
//     if (deletedPhoto instanceof Error) throw deletedPhoto

//     // Borramos la foto en la base de datos.
//     const destroyedPhoto = await destroyPhoto({ id: photoId })
//     if (destroyedPhoto instanceof Error) throw destroyedPhoto

//     res.send({
//       status: 'ok',
//       message: 'Foto eliminada'
//     })
//   } catch (err) {
//     next(err)
//   }
// }



async function addLikeController(req, res, next) {
  try {  
    // Obtener el id de los params
    const { entryId }= req.params;

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
    const result = await removeLike({ entryId, userId:req.user.id });

    res.json({
      status: "ok",
      message: result,
    });
  } catch (error) {
    next(error);
  }
}



// // Controlador para eliminar un like de una entrada.
// async function removeLikeController(req, res, next) {
//   try {
//     const { entryId, userId } = req.body;

//     // Llama a la función para eliminar el like.
//     const result = await removeLike({ entryId, userId });

//     res.json({
//       status: 'ok',
//       message: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// }
const searchEntriesByDescription = async (req, res) => {
  try {
    const { description } = req.query; // Obtén la descripción de los parámetros de consulta

    // Llama a la función getEntriesWithLikesAndPhotos con la descripción como parámetro
    const entries = await getEntriesWithLikesAndPhotosByDescription(description);

    if (!entries) {
      res.status(404).json({ error: "No se encontraron entradas con esa descripción." });
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
        status: 'error',
        message: 'El comentario no puede estar vacío.',
      });
    }

    // Comprobar si la entrada existe
    const entry = await getEntryById(id);
    if (!entry) {
      return res.status(404).json({
        status: 'error',
        message: 'La entrada no existe.',
      });
    }

    // Insertar el comentario en la base de datos
    const newComment = await insertComment({ entryId: id, userId, commentText });

    res.json({
      status: 'ok',
      data: {
        comment: newComment,
      },
    });
  } catch (error) {
    console.error('Error en addComment:', error);
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
        status: 'error',
        message: 'La entrada no existe.',
      });
    }

    // Comprobar si el comentario existe
    const comment = await getCommentById(commentId);
    if (!comment) {
      return res.status(404).json({
        status: 'error',
        message: 'El comentario no existe.',
      });
    }

    // Comprobar si el usuario logueado es el propietario del comentario
    if (comment.userId !== req.user.id) {
      return res.status(401).json({
        status: 'error',
        message: 'No tienes permiso para eliminar este comentario.',
      });
    }

    // Eliminar el comentario de la base de datos
    const deletedComment = await deleteCommentById(commentId);

    if (!deletedComment) {
      return res.status(404).json({
        status: 'error',
        message: 'El comentario no pudo ser eliminado.',
      });
    }

    res.json({
      status: 'ok',
      message: 'Comentario eliminado.',
    });
  } catch (error) {
    console.error('Error en deleteComment:', error);
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
        ;
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
  createEntry,
  listEntries,
  getEntry,
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
  getAllPhotosController,
  hasLikedEntryController
};