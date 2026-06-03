const express = require('express');
const { requireRole } = require('../middleware/requireRole');
const auditService = require('../services/auditService');
const { parsePagination, buildPageEnvelope } = require('../lib/pagination');

function createAdminRouter({ ensureAuth }) {
  const router = express.Router();
  const ensureAdmin = [ensureAuth, requireRole('admin')];

  router.get('/admin/audit', ensureAdmin, async (req, res, next) => {
    try {
      const { page, limit, skip } = parsePagination(req.query);
      const { items, total } = await auditService.listAuditTrail({ skip, limit });
      res.json(buildPageEnvelope({ page, limit, total, items }));
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { createAdminRouter };
