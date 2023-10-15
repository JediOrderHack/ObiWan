// Importamos las funciones queinteractúan con la base de datos.
import {
  insertEntryQuery,
  updateEntryQuery,
  insertLikeQuery,
  deleteLikeQuery,
  insertPhotoQuery,
  selectEntryByIdQuery,
  selectAllEntriesQuery,
  checkEntryLikeQuery
} from "../db/queries/entries_queries.js";

// Importamos la función que guarda una foto en disco.
import { saveImage } from "../services/photos.js";

// Importamos las variables necesarias para la configuración.
import { MAX_ENTRY_IMAGE_SIZE } from "../config.js";

// Importamos los esquemas de Joi.
import createEntrySchema from "../schemas/entries/createEntrySchema.js";
import editEntrySchema from "../schemas/entries/editEntrySchema.js";

// Importamos la función que valida esquemas.
import validateSchema from "../helpers/validate_schema.js";

// Importamos la función que genera errores.
import generateError from "../helpers/generate_error.js";

/**
 * ###################
 * ## Crear entrada ##
 * ###################
 */
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

/**
 * ###############################
 * ## Obtener lista de entradas ##
 * ###############################
 */
async function listEntriesController(req, res, next) {
  try {
    // Obtenemos la variable que me permite filtrar por descripción.
    const { search } = req.query;

    const entries = await selectAllEntriesQuery({
      userId: req.user?.id || 0,
      search: search || "",
    });

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

/**
 * ##################################
 * ## Obtener una entrada concreta ##
 * ##################################
 */
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

/**
 * #################################
 * ## Editar una entrada concreta ##
 * #################################
 */
async function editEntryController(req, res, next) {
  try {
    // Obtenemos los datos necesarios del body.
    const { description } = req.body;

    // Obtenemos el id de la entrada que queremos editar.
    const { entryId } = req.params;

    // Obtenemos el id del usuario que editará la entrada.
    const { id: userId } = req.user;

    try {
      await validateSchema(editEntrySchema, req.body);
    } catch (err) {
      // Maneja el error de validación, por ejemplo, respondiendo con un error 400.
      res.status(400).send("Los datos de la solicitud no son válidos.");
      return; // Termina la ejecución del controlador.
    }
    // Obtenemos los datos de la entrada que queremos editar.
    const entry = await selectEntryByIdQuery({ entryId, userId });

    // Lanzamos un error si no somos los dueños de la entrada.
    if (!entry.owner) {
      generateError("No tienes suficientes permisos", 401);
    }

    // Actualiza la entrada.
    await updateEntryQuery({ entryId, description });

    res.send({
      status: "ok",
      message: "Entrada actualizada",
    });
  } catch (err) {
    if (err.message === "Entrada no encontrada") {
      res.status(404).send("Entrada no encontrada");
    } else {
      next(err); // Maneja otros errores
    }
  }
}

/**
 * ##################
 * ## Agregar like ##
 * ##################
 */
async function addLikeController(req, res, next) {
  try {
    // Obtener el id de los params.
    const { entryId } = req.params;

    // Llama a la función para dar like.
    await insertLikeQuery({ entryId, userId: req.user.id });

    res.send({
      status: "ok",
      message: "Like agregado",
    });
  } catch (err) {
    next(err);
  }
}

async function removeLikeController(req, res, next) {
  try {
    // Obtener el id de los params.
    const { entryId } = req.params;

    // Llama a la función para eliminar el like.
    await deleteLikeQuery({ entryId, userId: req.user.id });

    res.send({
      status: "ok",
      message: "Like eliminado",
    });
  } catch (err) {
    next(err);
  }
}


// Define el controlador para verificar si un usuario ha dado "like" a una entrada específica.
async function checkEntryLikeController(req, res, next) {
  try {
    // Asegúrate de obtener el ID de usuario de manera adecuada. Por ejemplo, desde req.user.
    const userId = req.user.id;

    // Asegúrate de obtener el ID de entrada desde los parámetros de la solicitud.
    const entryId = req.params.entryId;

    // Utiliza la consulta para verificar si el usuario ha dado "like" a la entrada.
    const hasLiked = await checkEntryLikeQuery(userId, entryId);

    // Devuelve un valor booleano que indica si el usuario ha dado "like" a la entrada.
    res.send({ hasLiked });
  } catch (err) {
    next(err);
  }
}



export {
  createEntryController,
  listEntriesController,
  getEntryController,
  editEntryController,
  addLikeController,
  removeLikeController,
  checkEntryLikeController
};
