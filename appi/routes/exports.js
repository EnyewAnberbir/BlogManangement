const express = require('express');
const exportService = require('../services/exportService');

function createExportRouter({ ensureAuth }) {
  const router = express.Router();

  router.get('/exports/posts.csv', ensureAuth, async (req, res, next) => {
    try {
      const csv = await exportService.exportPublishedPosts(req.auth);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="posts.csv"');
      res.send(csv);
    } catch (error) {
      next(error);
    }
  });

  router.get('/exports/users.csv', ensureAuth, async (req, res, next) => {
    try {
      const csv = await exportService.exportUsers(req.auth);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
      res.send(csv);
    } catch (error) {
      next(error);
    }
  });

  router.get('/exports/comments.csv', ensureAuth, async (req, res, next) => {
    try {
      const csv = await exportService.exportComments(req.auth, req.query.status || 'approved');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="comments.csv"');
      res.send(csv);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { createExportRouter };
