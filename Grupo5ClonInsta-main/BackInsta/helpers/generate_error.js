function generate_error(message, status) {
  const err = new Error(message);
  err.httpStatus = status;
  throw status;
}

export default generate_error;
