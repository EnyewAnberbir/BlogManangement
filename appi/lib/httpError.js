function createHttpError(statusCode, message, expose = true) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.expose = expose;
  return error;
}

module.exports = { createHttpError };
