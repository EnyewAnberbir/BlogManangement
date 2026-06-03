const { createHealthRouter } = require('./health');
const { createAuthRouter } = require('./auth');
const { createPostRouter } = require('./posts');
const { createCommentRouter } = require('./comments');
const { createTaxonomyRouter } = require('./taxonomy');
const { createSearchRouter } = require('./search');
const { createAdminRouter } = require('./admin');
const { createNotificationRouter } = require('./notifications');
const { createMediaRouter } = require('./media');
const { createNewsletterRouter } = require('./newsletter');
const { createRevisionRouter } = require('./revisions');
const { createFollowRouter } = require('./follows');
const { createAnalyticsRouter } = require('./analytics');
const { createJobsRouter } = require('./jobs');
const { createExportRouter } = require('./exports');
const { createFeedRouter } = require('./feeds');

function mountApiRoutes(app, deps) {
  const routers = [
    createHealthRouter(),
    createAuthRouter(deps),
    createPostRouter(deps),
    createCommentRouter(deps),
    createTaxonomyRouter(),
    createSearchRouter(),
    createAdminRouter(deps),
    createNotificationRouter(deps),
    createMediaRouter(deps),
    createNewsletterRouter(deps),
    createRevisionRouter(deps),
    createFollowRouter(deps),
    createAnalyticsRouter(deps),
    createJobsRouter(deps),
    createExportRouter(deps),
    createFeedRouter(deps)
  ];

  for (const router of routers) {
    app.use(router);
    app.use('/api/v1', router);
  }
}

module.exports = { mountApiRoutes };
