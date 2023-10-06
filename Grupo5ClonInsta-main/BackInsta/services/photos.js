import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";

import { root, UPLOADS_DIR } from "../config.js";

async function saveAvatar ({ img, width }) {
  try {
    // Ruta absoluta al directorio de subida de archivos.
    const uploadsPath = path.resolve('..', UPLOADS_DIR)

    
    try {
      // Intentamos acceder al directorio de subida de archivos con el método "access".
      await fs.access(uploadsPath)
    } catch {
      // Si el método "access" lanza un error significa que el directorio no existe.
      // Lo creamos.
      await fs.mkdir(uploadsPath)
    }
    

    // Creamos un objeto de tipo Sharp con la imagen dada.
    const sharpImg = sharp(img.data)

    // Redimensionamos la imagen. Width representa un tamaño en píxeles.
    sharpImg.resize(width)

    // Generamos un nombre único para la imagen dado que no podemos guardar dos imágenes
    // con el mismo nombre en la carpeta uploads.
    const randomName = crypto.randomUUID()
    const imgName = `${randomName}.jpg`

    // Ruta absoluta a la imagen.
    const imgPath = path.join(uploadsPath, imgName)

    // Guardamos la imagen.
    sharpImg.toFile(imgPath)

    // Retornamos el nombre de la imagen.
    return imgName
  } catch (err) {
    console.error(err)
    return new Error('Error al guardar la imagen en el servidor')
  }
}



async function savePhoto({ images, width }) {
  console.log("Argumentos recibidos por savePhoto:", images);
  try {
    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new Error("Datos de imagen faltantes o inválidos");
    }

    const photoNames = [];

    for (const img of images) {
      if (!img || !img.data) {
        throw new Error("Datos de imagen faltantes o inválidos");
      }

      // Ruta absoluta al directorio de subida de archivos.
      const uploadsPath = path.resolve(root, UPLOADS_DIR);

      // Creamos un objeto de tipo Sharp con los datos de la imagen.
      const sharpImg = sharp(img.data);

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

      // Agregamos el nombre de la imagen al array de nombres.
      photoNames.push(imgName);

      // Agregamos un console.log para verificar que la imagen se haya guardado correctamente
      console.log("Imagen guardada:", imgName);
    }

    // Retornamos los nombres de las imágenes.
    return photoNames;
  } catch (err) {
    console.error("Error en savePhoto:", err);
    throw new Error("Error al guardar la imagen en el servidor");
  }
}


async function deletePhoto({ name }) {
  try {
    // Ruta absoluta al archivo que queremos eliminar.
    const imgPath = path.resolve(root, UPLOADS_DIR, name);

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

export { savePhoto, deletePhoto, saveAvatar };
