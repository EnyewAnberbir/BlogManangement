const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { createHttpError } = require('../lib/httpError');
const { extractTextPreview } = require('../lib/contentSanitizer');

function toCsvRow(values) {
  return values
    .map((value) => {
      const text = String(value ?? '');
      if (text.includes(',') || text.includes('"') || text.includes('\n')) {
        return `"${text.replace(/"/g, '""')}"`;
      }
      return text;
    })
    .join(',');
}

async function exportPublishedPosts(auth) {
  if (auth.role !== 'admin' && auth.role !== 'editor') {
    throw createHttpError(403, 'insufficient role');
  }

  const posts = await Post.find({ status: 'published' })
    .populate('author', ['username'])
    .populate('category', ['name'])
    .sort({ createdAt: -1 })
    .limit(1000);

  const header = toCsvRow([
    'id',
    'title',
    'slug',
    'author',
    'category',
    'views',
    'createdAt',
    'summaryPreview'
  ]);
  const rows = posts.map((post) =>
    toCsvRow([
      post._id,
      post.title,
      post.slug,
      post.author?.username,
      post.category?.name,
      post.viewCount,
      post.createdAt?.toISOString(),
      extractTextPreview(post.summary, 120)
    ])
  );

  return [header, ...rows].join('\n');
}

async function exportUsers(auth) {
  if (auth.role !== 'admin') {
    throw createHttpError(403, 'insufficient role');
  }

  const users = await User.find().sort({ createdAt: -1 }).limit(2000);
  const header = toCsvRow(['id', 'username', 'role', 'displayName', 'createdAt']);
  const rows = users.map((user) =>
    toCsvRow([user._id, user.username, user.role, user.displayName, user.createdAt?.toISOString()])
  );
  return [header, ...rows].join('\n');
}

async function exportComments(auth, status = 'approved') {
  if (auth.role !== 'admin' && auth.role !== 'editor') {
    throw createHttpError(403, 'insufficient role');
  }

  const comments = await Comment.find({ status })
    .populate('author', ['username'])
    .populate('post', ['title'])
    .sort({ createdAt: -1 })
    .limit(3000);

  const header = toCsvRow(['id', 'post', 'author', 'status', 'body', 'createdAt']);
  const rows = comments.map((comment) =>
    toCsvRow([
      comment._id,
      comment.post?.title,
      comment.author?.username,
      comment.status,
      extractTextPreview(comment.body, 200),
      comment.createdAt?.toISOString()
    ])
  );
  return [header, ...rows].join('\n');
}

module.exports = { exportPublishedPosts, exportUsers, exportComments, toCsvRow };
