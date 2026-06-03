const { createHttpError } = require('../lib/httpError');
const { parsePagination, buildPageEnvelope } = require('../lib/pagination');
const commentRepository = require('../repositories/commentRepository');
const postRepository = require('../repositories/postRepository');
const auditService = require('./auditService');
const notificationService = require('./notificationService');
const { validateCommentPayload } = require('../lib/validators');

async function addComment(auth, postId, body) {
  const payload = validateCommentPayload(body);
  const postDoc = await postRepository.findPostById(postId);
  if (!postDoc) {
    throw createHttpError(404, 'post not found');
  }

  const status = auth.role === 'admin' || auth.role === 'editor' ? 'approved' : 'pending';
  const comment = await commentRepository.createComment({
    post: postId,
    author: auth.id,
    body: payload.body,
    status
  });

  await auditService.record(auth.id, 'comment.create', 'comment', comment._id, { status });
  const authorId = postDoc.author?._id || postDoc.author;
  if (authorId && String(authorId) !== String(auth.id)) {
    await notificationService.notifyUser(
      authorId,
      'comment',
      'New comment',
      `Someone commented on "${postDoc.title}"`,
      { postId, commentId: comment._id }
    );
  }
  return comment;
}

async function listComments(postId, query) {
  const { page, limit, skip } = parsePagination(query);
  const status = query.includePending === 'true' ? undefined : 'approved';

  const [items, total] = await Promise.all([
    commentRepository.listByPost(postId, { status, skip, limit }),
    commentRepository.countByPost(postId, status)
  ]);

  if (query.withMeta === 'true') {
    return buildPageEnvelope({ page, limit, total, items });
  }

  return items;
}

async function moderateComment(auth, commentId, status) {
  if (auth.role !== 'editor' && auth.role !== 'admin') {
    throw createHttpError(403, 'insufficient role');
  }

  const allowed = ['approved', 'rejected', 'pending'];
  if (!allowed.includes(status)) {
    throw createHttpError(400, 'invalid comment status');
  }

  const comment = await commentRepository.findById(commentId);
  if (!comment) {
    throw createHttpError(404, 'comment not found');
  }

  const updated = await commentRepository.updateStatus(commentId, status);
  await auditService.record(auth.id, 'comment.moderate', 'comment', commentId, { status });
  return updated;
}

module.exports = { addComment, listComments, moderateComment };
