function requestLogger(req, res, next) {
  const startedAt = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    console.log(`[${req.requestId}] ${method} ${originalUrl} ${res.statusCode} ${durationMs}ms`);
  });

  next();
}

module.exports = requestLogger;
