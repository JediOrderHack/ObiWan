import axios from "axios";

const HttpService = axios.create({
  baseURL: "http://localhost:3000", // Cambia esto a la URL de tu servidor
  timeout: 5000, // Tiempo máximo de espera para las solicitudes en milisegundos
  headers: {
    "Content-Type": "application/json", // Tipo de contenido para las solicitudes
  },
});

// Puedes agregar interceptores, configuraciones de autenticación, etc., según tus necesidades.

export default HttpService;
