const AuthorFollow = require('../models/AuthorFollow');

async function followAuthor(followerId, authorId) {
  return AuthorFollow.findOneAndUpdate(
    { follower: followerId, author: authorId },
    {},
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function unfollowAuthor(followerId, authorId) {
  return AuthorFollow.findOneAndDelete({ follower: followerId, author: authorId });
}

async function listFollowing(followerId) {
  return AuthorFollow.find({ follower: followerId }).populate('author', [
    'username',
    'displayName',
    'bio'
  ]);
}

async function followerCount(authorId) {
  return AuthorFollow.countDocuments({ author: authorId });
}

module.exports = { followAuthor, unfollowAuthor, listFollowing, followerCount };
