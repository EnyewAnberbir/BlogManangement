const jwt = require('jsonwebtoken');
const { createHttpError } = require('../lib/httpError');

function requireAuth(jwtSecret) {
  return (req, _res, next) => {
    const { token } = req.cookies;
    if (!token) {
      return next(createHttpError(401, 'authentication required'));
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.auth = { id: decoded.id, username: decoded.username };
      next();
    } catch {
      next(createHttpError(401, 'invalid token'));
    }
  };
}

module.exports = { requireAuth };
