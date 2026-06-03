const express = require('express');
const multer = require('multer');
const mediaService = require('../services/mediaService');

const uploadMiddleware = multer({ dest: 'uploads/' });

function createMediaRouter({ ensureAuth }) {
  const router = express.Router();

  router.get('/media', ensureAuth, async (req, res, next) => {
    try {
      const payload = await mediaService.listMedia(req.auth, req.query);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.post('/media', ensureAuth, uploadMiddleware.single('file'), async (req, res, next) => {
    try {
      const payload = await mediaService.uploadMedia(req.auth, req.file, req.body);
      res.status(201).json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/media/:id', ensureAuth, async (req, res, next) => {
    try {
      const payload = await mediaService.deleteMedia(req.auth, req.params.id);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { createMediaRouter };
