const { createHealthRouter } = require('./health');
const { createAuthRouter } = require('./auth');
const { createPostRouter } = require('./posts');
const { createCommentRouter } = require('./comments');
const { createTaxonomyRouter } = require('./taxonomy');
const { createSearchRouter } = require('./search');
const { createAdminRouter } = require('./admin');

function mountApiRoutes(app, deps) {
  const routers = [
    createHealthRouter(),
    createAuthRouter(deps),
    createPostRouter(deps),
    createCommentRouter(deps),
    createTaxonomyRouter(),
    createSearchRouter(),
    createAdminRouter(deps)
  ];

  for (const router of routers) {
    app.use(router);
    app.use('/api/v1', router);
  }
}

module.exports = { mountApiRoutes };
