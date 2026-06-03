const express = require('express');
const { requireRole } = require('../middleware/requireRole');
const { runDigestJob } = require('../jobs/digestScheduler');

function createJobsRouter({ ensureAuth }) {
  const router = express.Router();

  router.post('/jobs/weekly-digest', ensureAuth, requireRole('admin'), async (_req, res, next) => {
    try {
      const payload = await runDigestJob();
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { createJobsRouter };
