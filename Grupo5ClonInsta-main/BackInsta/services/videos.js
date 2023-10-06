import path from "path";
import { MAX_VIDEO_DURATION, VIDEO_DIR } from "../config.js";
import fs from "fs/promises"; // Importa el módulo fs de Node.js para trabajar con archivos
import {getVideoDurationInSeconds} from 'get-video-duration'
// Ruta de la carpeta temporal
import { TEMP_DIR } from "../config.js";
import ContentError from "../errors/content_error.js";

// Función para guardar vídeos
async function saveVideo(video, filePath) {
  try {
    await fs.access(TEMP_DIR);
  } catch (error) {
    // Si el método access lanza un error, significa que el directorio no existe.
    // Lo creamos.
    await fs.mkdir(TEMP_DIR, { recursive: true });
  }

  // Ruta del archivo temporal
  const tempFilePath = path.join(TEMP_DIR, video.name);
  console.log("Ruta del archivo temporal:", tempFilePath);

  try {
    // Guarda el archivo en la carpeta temporal
    await fs.writeFile(tempFilePath, video.data);

    // Obtenemos la duración del video
    const duration = await getVideoDurationInSeconds(tempFilePath);
    console.log(duration);

    if (duration > MAX_VIDEO_DURATION) {
      const errorMessage = "Limite de duración alcanzado.";
      console.log(errorMessage);
      throw new ContentError({
        message: errorMessage,
        status: 418,
      });
    }

    try {
      await fs.access(VIDEO_DIR);
    } catch (error) {
      // Si el método access lanza un error, significa que el directorio no existe.
      // Lo creamos.
      await fs.mkdir(VIDEO_DIR, { recursive: true });
    }

    // Mueve el archivo a la carpeta final
    const videoName = Date.now() + "-" + video.name;
    const finalFilePath = path.join(VIDEO_DIR, videoName);
    console.log("Ruta del archivo final:", finalFilePath);
    await fs.rename(tempFilePath, finalFilePath);

    return videoName;
  } catch (error) {
    throw error; // Lanza el error para que sea manejado por el controlador que llama a esta función.
  }
}

export default saveVideo
