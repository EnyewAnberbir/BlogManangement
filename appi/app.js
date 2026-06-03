const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { getConfig } = require('./config');
const requestIdMiddleware = require('./middleware/requestId');
const requestLogger = require('./middleware/requestLogger');
const { requireAuth } = require('./middleware/auth');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { mountApiRoutes } = require('./routes');

function createApp(config = getConfig()) {
  const app = express();
  const ensureAuth = requireAuth(config.jwtSecret);

  app.locals.jwtSecret = config.jwtSecret;

  app.use(requestIdMiddleware);
  app.use(requestLogger);
  app.use(cors({ credentials: true, origin: config.corsOrigin }));
  app.use(express.json());
  app.use(cookieParser());
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  mountApiRoutes(app, { ensureAuth });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
