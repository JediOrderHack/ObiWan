function error404 (req, res, next) {
  res.status(404)
  res.json({
    error: {
      status: 404,
      name: 'Error404',
      message: 'Página no encontrada :('
    }
  })
}

export default error404