const newsletterRepository = require('../repositories/newsletterRepository');
const postRepository = require('../repositories/postRepository');

async function buildWeeklyDigest() {
  const subscribers = await newsletterRepository.listActive({ limit: 1000 });
  const posts = await postRepository.listPosts({
    filter: { status: 'published' },
    skip: 0,
    limit: 5
  });

  return {
    generatedAt: new Date().toISOString(),
    subscriberCount: subscribers.length,
    highlights: posts.map((post) => ({
      id: post._id,
      title: post.title,
      slug: post.slug,
      summary: post.summary
    }))
  };
}

async function runDigestJob() {
  const digest = await buildWeeklyDigest();
  return {
    ok: true,
    digest
  };
}

module.exports = { buildWeeklyDigest, runDigestJob };
