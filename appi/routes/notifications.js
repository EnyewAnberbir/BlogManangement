const express = require('express');
const notificationService = require('../services/notificationService');

function createNotificationRouter({ ensureAuth }) {
  const router = express.Router();

  router.get('/notifications', ensureAuth, async (req, res, next) => {
    try {
      const payload = await notificationService.listNotifications(req.auth, req.query);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.post('/notifications/:id/read', ensureAuth, async (req, res, next) => {
    try {
      const payload = await notificationService.markNotificationRead(req.auth, req.params.id);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.post('/notifications/read-all', ensureAuth, async (req, res, next) => {
    try {
      const payload = await notificationService.markAllNotificationsRead(req.auth);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { createNotificationRouter };
