const express = require('express');
const multer = require('multer');
const postService = require('../services/postService');

const uploadMiddleware = multer({ dest: 'uploads/' });

function createPostRouter({ ensureAuth }) {
  const router = express.Router();

  router.post('/post', ensureAuth, uploadMiddleware.single('file'), async (req, res, next) => {
    try {
      const postDoc = await postService.createPost(req.auth, req.body, req.file);
      res.json(postDoc);
    } catch (error) {
      next(error);
    }
  });

  router.put('/post', ensureAuth, uploadMiddleware.single('file'), async (req, res, next) => {
    try {
      const postDoc = await postService.updatePost(req.auth, req.body, req.file);
      res.json(postDoc);
    } catch (error) {
      next(error);
    }
  });

  router.post('/post/:id/publish', ensureAuth, async (req, res, next) => {
    try {
      const postDoc = await postService.publishPost(req.auth, req.params.id);
      res.json(postDoc);
    } catch (error) {
      next(error);
    }
  });

  router.get('/post', async (req, res, next) => {
    try {
      const result = await postService.listPosts(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get('/post/:id', async (req, res, next) => {
    try {
      const postDoc = await postService.getPostById(req.params.id, {
        trackView: req.query.trackView === 'true'
      });
      res.json(postDoc);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { createPostRouter };
