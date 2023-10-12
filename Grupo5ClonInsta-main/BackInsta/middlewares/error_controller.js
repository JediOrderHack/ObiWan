function errorController(err, req, res, next) {
  // Error logging.
  console.error(err);

  res.status(err.httpStatus || 500).send({
    status: "error",
    message: err.message,
  });
}

export default errorController;
