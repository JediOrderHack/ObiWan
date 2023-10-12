async function validateSchema(schema, data) {
  try {
    await schema.validateAsync(data);
  } catch (err) {
    err.httpStatus = 400;
    throw err;
  }
}

export default validateSchema;
