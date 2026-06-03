const { createHttpError } = require('../lib/httpError');
const followRepository = require('../repositories/followRepository');
const userRepository = require('../repositories/userRepository');
const notificationService = require('./notificationService');

async function follow(auth, authorId) {
  if (String(auth.id) === String(authorId)) {
    throw createHttpError(400, 'cannot follow yourself');
  }

  const author = await userRepository.findById(authorId);
  if (!author) {
    throw createHttpError(404, 'author not found');
  }

  const followDoc = await followRepository.followAuthor(auth.id, authorId);
  await notificationService.notifyUser(
    authorId,
    'system',
    'New follower',
    `${auth.username} started following you`,
    { followerId: auth.id }
  );
  return followDoc;
}

async function unfollow(auth, authorId) {
  const removed = await followRepository.unfollowAuthor(auth.id, authorId);
  if (!removed) {
    throw createHttpError(404, 'follow relationship not found');
  }
  return { ok: true };
}

async function listFollowing(auth) {
  return followRepository.listFollowing(auth.id);
}

async function followerStats(authorId) {
  const count = await followRepository.followerCount(authorId);
  return { authorId, followers: count };
}

module.exports = { follow, unfollow, listFollowing, followerStats };
