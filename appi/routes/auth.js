const express = require('express');
const { createHttpError } = require('../lib/httpError');
const { createRateLimiter } = require('../middleware/rateLimit');
const authService = require('../services/authService');

function createAuthRouter({ ensureAuth }) {
  const router = express.Router();
  const authRateLimit = createRateLimiter({ windowMs: 60_000, maxRequests: 20 });

  router.post('/register', authRateLimit, async (req, res, next) => {
    try {
      const userDoc = await authService.registerUser(req.body);
      res.json(userDoc);
    } catch (error) {
      if (error.code === 11000) {
        return next(createHttpError(409, 'username already exists'));
      }
      next(error.statusCode ? error : createHttpError(400, error.message));
    }
  });

  router.post('/login', authRateLimit, async (req, res, next) => {
    try {
      const { token, profile } = await authService.loginUser(req.body, req.app.locals.jwtSecret);
      res
        .cookie(authService.authCookieName, token, authService.buildAuthCookieOptions())
        .json(profile);
    } catch (error) {
      next(error);
    }
  });

  router.get('/profile', ensureAuth, (req, res) => {
    res.json(req.auth);
  });

  router.put('/profile', ensureAuth, async (req, res, next) => {
    try {
      const profile = await authService.updateProfile(req.auth, req.body);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  });

  router.post('/logout', (_req, res) => {
    res.cookie(authService.authCookieName, '', {
      ...authService.buildAuthCookieOptions(),
      expires: new Date(0)
    });
    res.json('ok');
  });

  return router;
}

module.exports = { createAuthRouter };
