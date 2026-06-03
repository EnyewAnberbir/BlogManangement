const express = require('express');
const followService = require('../services/followService');

function createFollowRouter({ ensureAuth }) {
  const router = express.Router();

  router.post('/authors/:authorId/follow', ensureAuth, async (req, res, next) => {
    try {
      const payload = await followService.follow(req.auth, req.params.authorId);
      res.status(201).json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/authors/:authorId/follow', ensureAuth, async (req, res, next) => {
    try {
      const payload = await followService.unfollow(req.auth, req.params.authorId);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.get('/following', ensureAuth, async (req, res, next) => {
    try {
      const payload = await followService.listFollowing(req.auth);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.get('/authors/:authorId/followers', async (req, res, next) => {
    try {
      const payload = await followService.followerStats(req.params.authorId);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { createFollowRouter };
