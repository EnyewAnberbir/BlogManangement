const { buildPostSearchFilter } = require('../lib/searchQuery');
const { parsePagination, buildPageEnvelope } = require('../lib/pagination');
const postRepository = require('../repositories/postRepository');

async function searchPosts(query) {
  const filter = buildPostSearchFilter(query.q);
  if (!filter) {
    return buildPageEnvelope({
      page: 1,
      limit: 20,
      total: 0,
      items: []
    });
  }

  const { page, limit, skip } = parsePagination(query);
  filter.status = 'published';

  const [items, total] = await Promise.all([
    postRepository.listPosts({ filter, skip, limit }),
    postRepository.countPosts(filter)
  ]);

  return buildPageEnvelope({ page, limit, total, items });
}

module.exports = { searchPosts };
