const express = require('express');
const feedService = require('../services/feedService');

function createFeedRouter({ ensureAuth }) {
  const router = express.Router();

  router.get('/feeds/home', async (req, res, next) => {
    try {
      const payload = await feedService.homeFeed(req.query);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.get('/feeds/following', ensureAuth, async (req, res, next) => {
    try {
      const payload = await feedService.followingFeed(req.auth, req.query);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.get('/feeds/category/:slug', async (req, res, next) => {
    try {
      const payload = await feedService.categoryFeed(req.params.slug, req.query);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.get('/feeds/tag/:slug', async (req, res, next) => {
    try {
      const payload = await feedService.tagFeed(req.params.slug, req.query);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { createFeedRouter };
