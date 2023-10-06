import CustomError from "./custom_error.js";

class EntryNotFound extends CustomError {
  constructor({ message = "Entrada no encontrada", status = 404 }) {
    super({ message, status });

    this.name = "EntryNotFound";
  }
}

export default EntryNotFound