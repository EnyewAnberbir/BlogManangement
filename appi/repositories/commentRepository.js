const Comment = require('../models/Comment');

async function createComment(payload) {
  return Comment.create(payload);
}

async function listByPost(postId, { status, skip = 0, limit = 50 } = {}) {
  const filter = { post: postId };
  if (status) filter.status = status;
  return Comment.find(filter)
    .populate('author', ['username', 'displayName'])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}

async function countByPost(postId, status) {
  const filter = { post: postId };
  if (status) filter.status = status;
  return Comment.countDocuments(filter);
}

async function findById(id) {
  return Comment.findById(id).populate('author', ['username', 'role']);
}

async function updateStatus(id, status) {
  return Comment.findByIdAndUpdate(id, { status }, { new: true });
}

module.exports = { createComment, listByPost, countByPost, findById, updateStatus };
