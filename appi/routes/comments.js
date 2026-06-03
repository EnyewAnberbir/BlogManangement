const express = require('express');
const commentService = require('../services/commentService');

function createCommentRouter({ ensureAuth }) {
  const router = express.Router();

  router.get('/post/:postId/comments', async (req, res, next) => {
    try {
      const comments = await commentService.listComments(req.params.postId, req.query);
      res.json(comments);
    } catch (error) {
      next(error);
    }
  });

  router.post('/post/:postId/comments', ensureAuth, async (req, res, next) => {
    try {
      const comment = await commentService.addComment(req.auth, req.params.postId, req.body);
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  });

  router.patch('/comments/:id/status', ensureAuth, async (req, res, next) => {
    try {
      const updated = await commentService.moderateComment(
        req.auth,
        req.params.id,
        req.body.status
      );
      res.json(updated);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { createCommentRouter };
