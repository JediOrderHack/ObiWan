// Importamos las dependencias.
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

// Importamos las variables necesarias para la configuración.
import { ROOT, UPLOADS_DIR } from "../config.js";

// Importamos la función que genera errores.
import generate_error from "../helpers/generate_error.js";

// Función que guarda una imagen en la carpeta uploads.
async function saveImage({ req, img, width }) {
  try {
    // Ruta absoluta al directorio de subida de archivos.
    const uploadsPath = path.resolve(ROOT, UPLOADS_DIR);

    try {
      // Intentamos acceder al directorio de subida de archivos con el método "access".
      await fs.access(uploadsPath);
    } catch {
      // Si el método "access" lanza un error significa que el directorio no existe.
      // Lo creamos.
      await fs.mkdir(uploadsPath);
    }

    // Creamos un objeto de tipo Sharp con la imagen dada.
    const sharpImg = sharp(img.data); // Cambiado req.files.avatar.data a img.data

    // Redimensionamos la imagen. Width representa un tamaño en píxeles.
    sharpImg.resize(width);

    // Generamos un nombre único para la imagen dado que no podemos guardar dos imágenes
    // con el mismo nombre en la carpeta uploads.
    const randomName = crypto.randomUUID();
    const imgName = `${randomName}.jpg`;

    // Ruta absoluta a la imagen.
    const imgPath = path.join(uploadsPath, imgName);

    // Guardamos la imagen.
    await sharpImg.toFile(imgPath);

    // Retornamos el nombre de la imagen.
    return imgName;
  } catch (err) {
    console.error(err);
    generate_error("Error al guardar el archivo en disco", 500);
  }
}

async function deletePhoto({ name }) {
  try {
    // Ruta absoluta al archivo que queremos eliminar.
    const imgPath = path.resolve(ROOT, UPLOADS_DIR, name);

    try {
      await fs.access(imgPath);
    } catch {
      // Si no existe el archivo, finalizamos la función.
      console.log("El archivo no existe:", name);
      return;
    }

    // Eliminamos el archivo de la carpeta de uploads.
    console.log("Eliminando archivo:", name);
    await fs.unlink(imgPath);
  } catch (err) {
    console.error("Error al eliminar la imagen del servidor:", err);
    return new Error("Error al eliminar la imagen del servidor");
  }
}

export { saveImage, deletePhoto };
