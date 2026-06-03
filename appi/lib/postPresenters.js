const { extractTextPreview } = require('./contentSanitizer');

function presentPostCard(post) {
  return {
    id: post._id,
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    summaryPreview: extractTextPreview(post.summary, 140),
    contentPreview: extractTextPreview(post.content, 220),
    status: post.status,
    viewCount: post.viewCount || 0,
    author: post.author
      ? {
          id: post.author._id,
          username: post.author.username,
          displayName: post.author.displayName
        }
      : null,
    tags: Array.isArray(post.tags)
      ? post.tags.map((tag) => ({ id: tag._id, name: tag.name, slug: tag.slug }))
      : [],
    category: post.category
      ? { id: post.category._id, name: post.category.name, slug: post.category.slug }
      : null,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  };
}

function presentPostFeed(posts) {
  return posts.map((post) => presentPostCard(post));
}

function presentRevision(revision) {
  return {
    id: revision._id,
    postId: revision.post,
    revisionNumber: revision.revisionNumber,
    title: revision.title,
    summary: revision.summary,
    status: revision.status,
    editor: revision.editor
      ? {
          id: revision.editor._id,
          username: revision.editor.username,
          displayName: revision.editor.displayName
        }
      : null,
    createdAt: revision.createdAt
  };
}

function presentNotification(notification) {
  return {
    id: notification._id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    readAt: notification.readAt,
    metadata: notification.metadata || {},
    createdAt: notification.createdAt
  };
}

module.exports = { presentPostCard, presentPostFeed, presentRevision, presentNotification };
