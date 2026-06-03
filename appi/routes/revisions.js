const express = require('express');
const revisionService = require('../services/revisionService');

function createRevisionRouter({ ensureAuth }) {
  const router = express.Router();

  router.get('/post/:postId/revisions', ensureAuth, async (req, res, next) => {
    try {
      const payload = await revisionService.listRevisions(req.auth, req.params.postId);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.post('/post/:postId/revisions/:revisionNumber/restore', ensureAuth, async (req, res, next) => {
    try {
      const payload = await revisionService.restoreRevision(
        req.auth,
        req.params.postId,
        req.params.revisionNumber
      );
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { createRevisionRouter };
