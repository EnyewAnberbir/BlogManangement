const express = require('express');
const searchService = require('../services/searchService');

function createSearchRouter() {
  const router = express.Router();

  router.get('/search/posts', async (req, res, next) => {
    try {
      const result = await searchService.searchPosts(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { createSearchRouter };
