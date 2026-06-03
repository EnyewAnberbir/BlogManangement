const express = require('express');
const tagService = require('../services/tagService');

function createTaxonomyRouter() {
  const router = express.Router();

  router.get('/tags', async (_req, res, next) => {
    try {
      const tags = await tagService.listTags();
      res.json(tags);
    } catch (error) {
      next(error);
    }
  });

  router.get('/categories', async (_req, res, next) => {
    try {
      const categories = await tagService.listCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { createTaxonomyRouter };
