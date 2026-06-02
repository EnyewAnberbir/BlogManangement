function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Not Found',
    requestId: req.requestId
  });
}

function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.expose ? err.message : 'Internal server error';

  if (statusCode >= 500) {
    console.error(`[${req.requestId}]`, err);
  }

  res.status(statusCode).json({
    error: message,
    requestId: req.requestId
  });
}

module.exports = { notFoundHandler, errorHandler };
