const express = require('express');
const { requireRole } = require('../middleware/requireRole');
const analyticsService = require('../services/analyticsService');

function createAnalyticsRouter({ ensureAuth }) {
  const router = express.Router();

  router.get(
    '/analytics/dashboard',
    ensureAuth,
    requireRole('editor'),
    async (req, res, next) => {
      try {
        const payload = await analyticsService.buildDashboard(req.auth);
        res.json(payload);
      } catch (error) {
        next(error);
      }
    }
  );

  router.get('/analytics/me', ensureAuth, async (req, res, next) => {
    try {
      const payload = await analyticsService.authorInsights(req.auth);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { createAnalyticsRouter };
