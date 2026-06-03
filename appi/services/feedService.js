const postRepository = require('../repositories/postRepository');
const tagRepository = require('../repositories/tagRepository');
const categoryRepository = require('../repositories/categoryRepository');
const followRepository = require('../repositories/followRepository');
const { parsePagination, buildPageEnvelope } = require('../lib/pagination');
const { presentPostFeed } = require('../lib/postPresenters');

async function homeFeed(query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const filter = { status: 'published' };
  const [posts, total] = await Promise.all([
    postRepository.listPosts({ filter, skip, limit }),
    postRepository.countPosts(filter)
  ]);

  return buildPageEnvelope({
    page,
    limit,
    total,
    items: presentPostFeed(posts)
  });
}

async function followingFeed(auth, query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const follows = await followRepository.listFollowing(auth.id);
  const authorIds = follows.map((entry) => entry.author?._id).filter(Boolean);

  if (!authorIds.length) {
    return buildPageEnvelope({ page, limit, total: 0, items: [] });
  }

  const filter = { status: 'published', author: { $in: authorIds } };
  const [posts, total] = await Promise.all([
    postRepository.listPosts({ filter, skip, limit }),
    postRepository.countPosts(filter)
  ]);

  return buildPageEnvelope({
    page,
    limit,
    total,
    items: presentPostFeed(posts)
  });
}

async function categoryFeed(slug, query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const category = await categoryRepository.findBySlug(slug);
  if (!category) {
    return buildPageEnvelope({ page, limit, total: 0, items: [] });
  }

  const filter = { status: 'published', category: category._id };
  const [posts, total] = await Promise.all([
    postRepository.listPosts({ filter, skip, limit }),
    postRepository.countPosts(filter)
  ]);

  return buildPageEnvelope({
    page,
    limit,
    total,
    items: presentPostFeed(posts)
  });
}

async function tagFeed(slug, query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const tag = await tagRepository.findBySlug(slug);
  if (!tag) {
    return buildPageEnvelope({ page, limit, total: 0, items: [] });
  }

  const filter = { status: 'published', tags: tag._id };
  const [posts, total] = await Promise.all([
    postRepository.listPosts({ filter, skip, limit }),
    postRepository.countPosts(filter)
  ]);

  return buildPageEnvelope({
    page,
    limit,
    total,
    items: presentPostFeed(posts)
  });
}

module.exports = { homeFeed, followingFeed, categoryFeed, tagFeed };
