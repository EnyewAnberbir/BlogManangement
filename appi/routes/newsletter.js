const express = require('express');
const newsletterService = require('../services/newsletterService');

function createNewsletterRouter({ ensureAuth }) {
  const router = express.Router();

  router.post('/newsletter/subscribe', async (req, res, next) => {
    try {
      const payload = await newsletterService.subscribe(req.body.email, req.body.source);
      res.status(201).json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.post('/newsletter/unsubscribe', async (req, res, next) => {
    try {
      const payload = await newsletterService.unsubscribe(req.body.email);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.get('/newsletter/stats', ensureAuth, async (req, res, next) => {
    try {
      const payload = await newsletterService.getNewsletterStats(req.auth);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.get('/newsletter/export', ensureAuth, async (req, res, next) => {
    try {
      const payload = await newsletterService.exportAudience(req.auth);
      res.json({ emails: payload });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { createNewsletterRouter };
