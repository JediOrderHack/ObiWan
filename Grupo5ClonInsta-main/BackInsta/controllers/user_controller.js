import crypto from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import {
  selectUserByIdQuery,
  newUser,
  updateUserRegCode,
  updateUserAvatar,
  updateUserRecoverPass,
  updateUserPass,
  getUserWithAll,
  getAllUser,
} from "../db/queries/users_queries.js";

// Helpers
import encryptPassword from "../helpers/encrypt_password.js";
import randomDigits from "../helpers/random_digits.js";

// SendMail
import sendMail from "../services/send_mail.js";
import recoveryPassword from "../mails/recovery_password.js";
import validationCode from "../mails/validation_code.js";

// Config
import { SECRET } from "../config.js";

// Services
import { saveImage, deletePhoto } from "../services/photos.js";

// Errors
import AuthError from "../errors/auth_error.js";
import AccessError from "../errors/access_error.js";
import ValidationError from "../errors/validation_error.js";

async function createUser(req, res, next) {
  try {
    const { email, username, password } = req.body; // Agregamos esta línea para obtener los datos de la solicitud.

    // Creamos un esquema para validar los datos de la solicitud.
    const schema = Joi.object({
      email: Joi.string().email().required(),
      username: Joi.string().required(),
      password: Joi.string()
        .min(8)
        .pattern(
          new RegExp("^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:'\",.<>/?]+$")
        )
        .required(),
    });

    // Validamos los datos de la solicitud.
    const { error } = schema.validate({ email, username, password }); // Validamos los datos que hemos obtenido.

    if (error) {
      throw new ValidationError({
        message: error.details[0].message,
        field: error.details[0].path[0],
      });
    }

    // Generamos el código de registro.
    const registrationCode = crypto.randomUUID();

    // Encriptamos la contraseña.
    const hashedPass = await encryptPassword({ password });

    // Insertamos al usuario en la base de datos.
    const user = await newUser({
      email,
      username,
      password: hashedPass,
      registrationCode,
    });
    if (user instanceof Error) throw user;

    const emailSubject = "Activa tu usuario en Meow";
    const emailBody = validationCode({ username, registrationCode });

    const sentMail = await sendMail(user.email, emailSubject, emailBody);
    if (sentMail instanceof Error) throw sentMail;

    res.json({
      status: "ok",
      message: "Usuario creado, revisa el email de verificación",
    });
  } catch (err) {
    next(err);
  }
}

// async function createUser (req, res, next) {
//   try {
//     const { email, username, password } = req.body

//     if (!email) throw new ValidationError({ message: 'El campo email es obligatorio', field: 'email' })
//     if (!password) throw new ValidationError({ message: 'El campo password es obligatorio', field: 'password' })
//     if (!username) throw new ValidationError({ message: 'El campo username es obligatorio', field: 'username' })

//     // Generamos el código de registro.
//     const registrationCode = crypto.randomUUID()

//     // Encriptamos la contraseña.
//     const hashedPass = await encryptPassword({ password })

//     // Insertamos al usuario en la base de datos.
//     const user = await newUser({ email, username, password: hashedPass, registrationCode })
//     if (user instanceof Error) throw user

//     const emailSubject = 'Activa tu usuario en meow'
//     const emailBody = validationCode({ username, registrationCode })

//     const sentMail = await sendMail(user.email, emailSubject, emailBody)
//     if (sentMail instanceof Error) throw sentMail

//     res.json({
//       status: 'ok',
//       message: 'Usuario creado, revisa el email de verificación'
//     })
//   } catch (err) {
//     next(err)
//   }
// }

async function validateUser(req, res, next) {
  // Creamos un esquema para validar los datos de la solicitud.
  const schema = Joi.object({
    regCode: Joi.string().required(),
  });

  // Validamos los datos de la solicitud.
  const { error } = schema.validate(req.params);
  if (error) {
    throw new ValidationError({
      message: error.details[0].message,
      field: error.details[0].path[0],
    });
  }

  // Llamamos a la función para actualizar el código de registro del usuario.
  const validation = await updateUserRegCode({
    registrationCode: req.params.regCode,
  });
  if (validation instanceof Error) throw validation;

  res.json({
    status: "ok",
    message: "Usuario creado",
  });
}
// async function validateUser (req, res, next) {
//   const { regCode } = req.params

//   try {
//     const validation = await updateUserRegCode({ registrationCode: regCode })
//     if (validation instanceof Error) throw validation

//     res.json({
//       status: 'ok',
//       message: 'Usuario creado'
//     })
//   } catch (error) {
//     next(error)
//   }
// }

async function loginUser(req, res, next) {
  const { email, password } = req.body;

  try {
    // Creamos un esquema para validar los datos de la solicitud.
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    // Validamos los datos de la solicitud.
    const { error } = schema.validate({ email, password });

    if (error) {
      throw new ValidationError({
        message: error.details[0].message,
        field: error.details[0].context.key,
      });
    }

    const user = await selectEntryByIdQuery({ email });
    if (user instanceof Error) throw user;

    // Revisamos si el usuario está activado.
    if (!user.active)
      throw new AccessError({ message: "Primero debes activar tu usuario" });

    // Comprobamos si las contraseñas coinciden.
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      throw new AuthError({
        message: "Usuario o contraseña incorrectos",
        status: 401,
      });

    // Objeto con información que queremos agregar al token.
    const tokenInfo = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(tokenInfo, SECRET, { expiresIn: "7d" });
    res.json({
      status: "ok",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getUser(req, res, next) {
  try {
    const userIdSchema = Joi.object({
      userId: Joi.string().required(),
    });

    const { error } = userIdSchema.validate(req.params);

    if (error) {
      throw new ValidationError({
        message: error.details[0].message,
        field: error.details[0].path[0],
      });
    }

    const user = await getUserWithAll({ id: req.params.userId });
    if (user instanceof Error) throw user;

    if (!user) throw new AccessError({ message: "Usuario no encontrado" });

    // Construimos el objeto de retorno con todas las relaciones
    const returnUser = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      entries: user.entries.map((entry) => {
        const entryWithPhotos = {
          description: entry.description,
          createdAt: entry.createdAt,
          photos: Array.isArray(user.photos)
            ? user.photos.filter((photo) => photo.entryId === entry.id)
            : [],
          videos: Array.isArray(user.videos)
            ? user.videos.filter((video) => video.entryId === entry.id)
            : [],
          likes: Array.isArray(user.likes)
            ? user.likes.filter((like) => like.post_id === entry.id)
            : [],
          comments: Array.isArray(user.comments)
            ? user.comments.filter((comment) => comment.entryId === entry.id)
            : [],
        };
        return entryWithPhotos;
      }),
    };

    // Agregamos el email y createdAt si es el propio usuario

    res.json({ user: returnUser });
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
    const user = await selectEntryByIdQuery({ id: req.user.id });
    if (user instanceof Error) {
      console.error("Error al obtener usuario:", user);
      throw user;
    }

    // Si el usuario tiene un avatar previo, lo eliminamos.
    if (user.avatar) {
      console.log("Eliminando avatar anterior:", user.avatar);
      await deletePhoto({ name: user.avatar });
    }

    // Guardamos el avatar en una carpeta del servidor y obtenemos el nombre con el que lo hemos guardado.
    const avatar = await saveImage({ images: [req.files.avatar], width: 100 });
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
    const user = await selectEntryByIdQuery({ email });

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

// async function editUserPass (req, res, next) {
//   try {
//     const { recoveryPassCode, newPass } = req.body

//     if (!newPass) throw new ValidationError({ message: 'El campo newPass es obligatorio', status: 400 })
//     if (!recoveryPassCode) throw new ValidationError({ message: 'El campo recoveryPassCode es obligatorio', status: 400 })

//     // Encriptamos la contraseña
//     const hashedPass = await encryptPassword({ password: newPass })

//     // Actualizamos el usuario con la información entregada
//     const updatedUser = await updateUserPass({ recoveryPassCode, newPass: hashedPass })
//     if (updatedUser instanceof Error) throw updatedUser

//     res.send({
//       status: 'ok',
//       message: 'Contraseña actualizada'
//     })
//   } catch (err) {
//     next(err)
//   }
// }

async function allUsers(req, res, next) {
  try {
    const users = await getAllUser();
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

export {
  createUser,
  validateUser,
  loginUser,
  getUser,
  editUserAvatar,
  sendRecoverPass,
  editUserPass,
  allUsers,
};
