const Post = require('../models/Post');

function basePostQuery(filter = {}) {
  return Post.find(filter).populate('author', ['username', 'displayName', 'role']);
}

async function createPost(payload) {
  return Post.create(payload);
}

async function findPostById(id) {
  return Post.findById(id)
    .populate('author', ['username', 'displayName', 'role'])
    .populate('tags', ['name', 'slug'])
    .populate('category', ['name', 'slug']);
}

async function savePost(postDoc) {
  return postDoc.save();
}

async function listPosts({ filter = {}, skip, limit, sort = { createdAt: -1 } }) {
  const query = basePostQuery(filter).sort(sort).skip(skip).limit(limit);
  return query;
}

async function countPosts(filter = {}) {
  return Post.countDocuments(filter);
}

async function incrementViewCount(id) {
  return Post.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true });
}

module.exports = {
  createPost,
  findPostById,
  savePost,
  listPosts,
  countPosts,
  incrementViewCount
};
