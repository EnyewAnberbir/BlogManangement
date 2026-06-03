const PostRevision = require('../models/PostRevision');

async function nextRevisionNumber(postId) {
  const latest = await PostRevision.findOne({ post: postId })
    .sort({ revisionNumber: -1 })
    .select('revisionNumber');
  return (latest?.revisionNumber || 0) + 1;
}

async function createRevision(payload) {
  return PostRevision.create(payload);
}

async function listForPost(postId, { skip = 0, limit = 20 } = {}) {
  return PostRevision.find({ post: postId })
    .populate('editor', ['username', 'displayName'])
    .sort({ revisionNumber: -1 })
    .skip(skip)
    .limit(limit);
}

async function findRevision(postId, revisionNumber) {
  return PostRevision.findOne({ post: postId, revisionNumber }).populate('editor', [
    'username',
    'displayName'
  ]);
}

module.exports = { nextRevisionNumber, createRevision, listForPost, findRevision };
