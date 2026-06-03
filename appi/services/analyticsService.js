const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const AuditEvent = require('../models/AuditEvent');
const { createHttpError } = require('../lib/httpError');

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function daysAgo(count) {
  const date = new Date();
  date.setDate(date.getDate() - count);
  return startOfDay(date);
}

async function countCreatedSince(model, since) {
  return model.countDocuments({ createdAt: { $gte: since } });
}

async function topPostsByViews(limit = 10) {
  return Post.find({ status: 'published' })
    .sort({ viewCount: -1 })
    .limit(limit)
    .select(['title', 'slug', 'viewCount', 'createdAt', 'author'])
    .populate('author', ['username']);
}

async function postsPublishedPerDay(days = 14) {
  const since = daysAgo(days);
  const rows = await Post.aggregate([
    { $match: { createdAt: { $gte: since }, status: 'published' } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return rows.map((row) => ({ date: row._id, count: row.count }));
}

async function commentsPerDay(days = 14) {
  const since = daysAgo(days);
  const rows = await Comment.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  return rows.map((row) => ({ date: row._id, count: row.count }));
}

async function authorLeaderboard(limit = 10) {
  const rows = await Post.aggregate([
    { $match: { status: 'published' } },
    {
      $group: {
        _id: '$author',
        posts: { $sum: 1 },
        views: { $sum: '$viewCount' }
      }
    },
    { $sort: { views: -1 } },
    { $limit: limit }
  ]);

  const authorIds = rows.map((row) => row._id);
  const authors = await User.find({ _id: { $in: authorIds } }).select([
    'username',
    'displayName',
    'role'
  ]);
  const authorMap = new Map(authors.map((author) => [String(author._id), author]));

  return rows.map((row) => ({
    author: authorMap.get(String(row._id)) || { _id: row._id },
    posts: row.posts,
    views: row.views
  }));
}

async function moderationQueue() {
  const pendingComments = await Comment.countDocuments({ status: 'pending' });
  const draftPosts = await Post.countDocuments({ status: 'draft' });
  return { pendingComments, draftPosts };
}

async function recentAuditActivity(limit = 20) {
  return AuditEvent.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('actor', ['username', 'role'])
    .select(['action', 'resourceType', 'resourceId', 'metadata', 'createdAt', 'actor']);
}

async function buildDashboard(auth) {
  if (auth.role !== 'admin' && auth.role !== 'editor') {
    throw createHttpError(403, 'insufficient role');
  }

  const sinceWeek = daysAgo(7);
  const [
    totalPosts,
    totalUsers,
    totalComments,
    postsThisWeek,
    commentsThisWeek,
    usersThisWeek,
    topPosts,
    publishTrend,
    commentTrend,
    leaderboard,
    moderation,
    auditTrail
  ] = await Promise.all([
    Post.countDocuments(),
    User.countDocuments(),
    Comment.countDocuments(),
    countCreatedSince(Post, sinceWeek),
    countCreatedSince(Comment, sinceWeek),
    countCreatedSince(User, sinceWeek),
    topPostsByViews(8),
    postsPublishedPerDay(21),
    commentsPerDay(21),
    authorLeaderboard(8),
    moderationQueue(),
    recentAuditActivity(15)
  ]);

  return {
    totals: {
      posts: totalPosts,
      users: totalUsers,
      comments: totalComments
    },
    week: {
      posts: postsThisWeek,
      comments: commentsThisWeek,
      users: usersThisWeek
    },
    topPosts,
    publishTrend,
    commentTrend,
    leaderboard,
    moderation,
    auditTrail
  };
}

async function authorInsights(auth) {
  const posts = await Post.countDocuments({ author: auth.id });
  const published = await Post.countDocuments({ author: auth.id, status: 'published' });
  const drafts = await Post.countDocuments({ author: auth.id, status: 'draft' });
  const viewsAgg = await Post.aggregate([
    { $match: { author: auth.id } },
    { $group: { _id: null, views: { $sum: '$viewCount' } } }
  ]);
  const views = viewsAgg[0]?.views || 0;

  return {
    posts,
    published,
    drafts,
    views
  };
}

module.exports = {
  buildDashboard,
  authorInsights,
  topPostsByViews,
  postsPublishedPerDay,
  commentsPerDay,
  authorLeaderboard,
  moderationQueue
};
