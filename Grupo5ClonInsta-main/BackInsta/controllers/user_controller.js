import crypto from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import {
  insertuserQuery,
  updateUserRegCodeQuery,
  selectUserByEmailQuery,
  selectUserByIdQuery,
  selectUserPhotosQuery,
  updateUserAvatar,
  updateUserRecoverPass,
  updateUserPass,
  selectUserQuery,
  getUserBy
} from "../db/queries/users_queries.js";

// Helpers
import encryptPassword from "../helpers/encrypt_password.js";
import randomDigits from "../helpers/random_digits.js";

// SendMail
import sendMail from "../services/send_mail.js";
import recoveryPassword from "../mails/recovery_password.js";

// Config
import { CLIENT, SECRET } from "../config.js";

// Services
import { saveImage, deletePhoto } from "../services/photos.js";

// Errors
import AuthError from "../errors/auth_error.js";
import AccessError from "../errors/access_error.js";
import ValidationError from "../errors/validation_error.js";

// Importamos los esquemas de Joi.
import createUserSchema from "../schemas/users/createUserSchema.js";
import loginUserSchema from "../schemas/users/loginUserSchema.js";

// Importamos la función que valida esquemas.
import validateSchema from "../helpers/validate_schema.js";

// Importamos la función que genera errores.
import generateError from "../helpers/generate_error.js";

/**
 * ###################
 * ## Crear usuario ##
 * ###################
 */
async function createUserController(req, res, next) {
  try {
    // Validamos los datos que envía el usuari con Joi.
    await validateSchema(createUserSchema, req.body);

    // Obtenemos los datos necesarios del body.
    const { email, username, password } = req.body;

    // Generamos el código de registro.
    const registrationCode = crypto.randomUUID();

    // Encriptamos la contraseña.
    const hashedPass = await encryptPassword({ password });

    // Insertamos al usuario en la base de datos.
    await insertuserQuery({
      email,
      username,
      password: hashedPass,
      registrationCode,
    });

    const emailSubject = "Activa tu usuario en Meow";

    const emailBody = `¡Bienvenid@ ${username}!
    Por favor verifica el usuario a través de la dirección: http://localhost:${CLIENT}/users/validate/${registrationCode}`;

    await sendMail(email, emailSubject, emailBody);

    res.send({
      status: "ok",
      message: "Usuario creado, revisa el email de verificación",
    });
  } catch (err) {
    next(err);
  }
}

/**
 * #####################
 * ## Validar usuario ##
 * #####################
 */
async function validateUserController(req, res, next) {
  try {
    // Obtenemos el código de registro de los path params.
    const { regCode } = req.params;

    // Llamamos a la función para actualizar el código de registro del usuario.
    await updateUserRegCodeQuery({
      registrationCode: regCode,
    });

    res.json({
      status: "ok",
      message: "Usuario activado",
    });
  } catch (err) {
    next(err);
  }
}

/**
 * ######################
 * ## Login de usuario ##
 * ######################
 */
async function loginUserController(req, res, next) {
  try {
    // Validamos los datos que envía el usuari con Joi.
    await validateSchema(loginUserSchema, req.body);

    // Obtenemos los datos del body.
    const { email, password } = req.body;

    // Obtenemos los datos del usuario.
    const user = await selectUserByEmailQuery({ email });

    // Comprobamos si las contraseñas coinciden.
    const validPass = await bcrypt.compare(password, user.password);

    // Si las contraseñas no coinciden lanzamos un error.
    if (!validPass) generateError("Contraseña incorrecta", 401);

    // Si el usuario no está activo lanzamos un error.
    if (!user.active) {
      generateError("Usuario pendiente de activar", 401);
    }

    // Objeto con información que queremos agregar al token.
    const tokenInfo = {
      id: user.id,
    };

    // Generamos el token.
    const token = jwt.sign(tokenInfo, SECRET, { expiresIn: "7d" });

    res.json({
      status: "ok",
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * ############################
 * ## Obtener perfil privado ##
 * ############################
 */
async function getUserPrivateProfileController(req, res, next) {
  try {
    // Obtenemos los datos del usuario.
    const user = await selectUserByIdQuery({ userId: req.user.id });

    res.send({
      status: "ok",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * ############################
 * ## Obtener perfil público ##
 * ############################
 */

async function getUserPublicProfileController(req, res, next) {
  try {
    // Obtenemos el id del usuario de los path params.
    const { id: userId } = req.params;

    // Obtenemos los datos del usuario.
    const user = await selectUserByIdQuery({ userId });

    // Eliminamos el email.
    delete user.email;

    // Obtenemos las fotos del usuario.
    const entries = await selectUserPhotosQuery({
      publicUserId: userId,
      tokenUserId: req.user?.id || 0,
    });

    res.send({
      status: "ok",
      data: {
        user: {
          ...user,
          entries,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

async function editUserAvatar(req, res, next) {
  try {
    // Agregar un console log para verificar que la función editUserAvatar se está ejecutando
    console.log("Entrando en editUserAvatar");

    // Creamos un esquema para validar la solicitud de edición de avatar
    const schema = Joi.object({
      avatar: Joi.any().required(), // Validamos que haya un campo 'avatar' en la solicitud
    });

    // Puedes agregar un console.log para verificar que se está procesando la solicitud.
    console.log("Solicitud de edición de avatar:", req.files);

    // Validamos la solicitud
    const { error } = schema.validate(req.files, { allowUnknown: true }); // Usamos req.files para validar la presencia del avatar

    if (error) {
      console.error("Error de validación de avatar:", error);
      throw new ValidationError({
        message: "Faltan campos",
        field: "avatar",
      });
    }

    if (!req.files || !req.files.avatar) {
      console.error("El campo 'avatar' no está presente en la solicitud.");
      throw new Error("Campo 'avatar' faltante en la solicitud.");
    }

    // Obtenemos los datos del usuario para comprobar si ya tiene un avatar previo.
    const user = await getUserBy({ id: req.user.id });
    if (user instanceof Error) {
      console.error("Error al obtener usuario:", user);
      throw user;
    }

    // Si el usuario tiene un avatar previo, lo eliminamos.
    if (user.avatar) {
      console.log("Eliminando avatar anterior:", user.avatar);
      await deletePhoto({ name: user.avatar });
    }

    // Llamamos a la función saveImage pasando la solicitud (req) como argumento
    const avatar = await saveImage({ req, img: req.files.avatar, width: 100 });
    console.log("Avatar guardado:", avatar);

    const savedAvatar = await updateUserAvatar({ avatar, userId: req.user.id });
    if (savedAvatar instanceof Error) {
      console.error("Error al actualizar avatar:", savedAvatar);
      throw savedAvatar;
    }

    res.send({
      status: "ok",
      message: "Avatar actualizado",
    });
  } catch (err) {
    console.error("Error en editUserAvatar:", err);
    next(err);
  }
}


async function sendRecoverPass(req, res, next) {
  try {
    // Definimos un esquema de Joi para validar la solicitud.
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });

    // Validamos la solicitud utilizando el esquema.
    const { error } = schema.validate(req.body);

    // Si hay un error de validación, lanzamos una excepción con detalles.
    if (error) {
      throw new ValidationError({
        message: error.details[0].message,
        field: error.details[0].context.key,
        status: 400,
      });
    }

    // Obtenemos el campo 'email' de la solicitud.
    const { email } = req.body;

    // Buscamos un usuario en función del correo electrónico.
    const user = await selectUserQuery({ email });

    // Si ocurre un error al buscar el usuario, lanzamos una excepción.
    if (user instanceof Error) {
      throw user;
    }

    // Si no se encuentra un usuario, lanzamos una excepción de acceso.
    if (!user) {
      throw new AccessError({ message: "Usuario no encontrado" });
    }

    // Generamos un código de recuperación de contraseña.
    const recoverPassCode = randomDigits({ number: 9 });

    // Actualizamos el código de recuperación en la base de datos.
    const insertedCode = await updateUserRecoverPass({
      id: user.id,
      recoverPassCode,
    });

    // Si ocurre un error al actualizar el código, lanzamos una excepción.
    if (insertedCode instanceof Error) {
      throw insertedCode;
    }

    // Definimos el asunto y el cuerpo del correo electrónico.
    const emailSubject = "Recuperación de Meowseña";
    const emailBody = recoveryPassword({ recoverPassCode });

    // Enviamos el correo electrónico.
    const sentMail = await sendMail(email, emailSubject, emailBody);

    // Si ocurre un error al enviar el correo, lanzamos una excepción.
    if (sentMail instanceof Error) {
      throw sentMail;
    }

    // Enviamos una respuesta de éxito.
    res.send({
      status: "ok",
      message: "Correo de recuperación enviado",
    });
  } catch (err) {
    // Manejamos errores y los pasamos al middleware 'next'.
    console.log(err);
    next(err);
  }
}


async function editUserPass(req, res, next) {
  try {
    const schema = Joi.object({
      recoveryPassCode: Joi.string().required(),
      newPass: Joi.string().min(8).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      throw new ValidationError({
        message: error.details[0].message,
        field: error.details[0].context.key,
        status: 400,
      });
    }

    const { recoveryPassCode, newPass } = req.body;

    // Encriptamos la contraseña
    const hashedPass = await encryptPassword({ password: newPass });

    // Actualizamos el usuario con la información entregada
    const updatedUser = await updateUserPass({
      recoveryPassCode,
      newPass: hashedPass,
    });

    if (updatedUser instanceof Error) {
      throw updatedUser;
    }

    res.send({
      status: "ok",
      message: "Contraseña actualizada",
    });
  } catch (err) {
    next(err);
  }
}





export {
  createUserController,
  validateUserController,
  loginUserController,
  getUserPrivateProfileController,
  getUserPublicProfileController,
  editUserAvatar,
  sendRecoverPass,
  editUserPass,
};