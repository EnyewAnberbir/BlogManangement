const { createHttpError } = require('../lib/httpError');
const revisionRepository = require('../repositories/revisionRepository');
const postRepository = require('../repositories/postRepository');
const auditService = require('./auditService');

async function snapshotPost(postDoc, editorId) {
  try {
    const revisionNumber = await revisionRepository.nextRevisionNumber(postDoc._id);
    return await revisionRepository.createRevision({
    post: postDoc._id,
    editor: editorId,
    title: postDoc.title,
    summary: postDoc.summary,
    content: postDoc.content,
    status: postDoc.status,
    revisionNumber
    });
  } catch {
    return null;
  }
}

async function listRevisions(auth, postId) {
  const postDoc = await postRepository.findPostById(postId);
  if (!postDoc) {
    throw createHttpError(404, 'post not found');
  }

  const authorId = postDoc.author?._id || postDoc.author;
  const canView =
    authorId.equals(auth.id) || auth.role === 'editor' || auth.role === 'admin';
  if (!canView) {
    throw createHttpError(403, 'you are not allowed to view revisions');
  }

  return revisionRepository.listForPost(postId);
}

async function restoreRevision(auth, postId, revisionNumber) {
  const postDoc = await postRepository.findPostById(postId);
  if (!postDoc) {
    throw createHttpError(404, 'post not found');
  }

  const authorId = postDoc.author?._id || postDoc.author;
  if (!authorId.equals(auth.id) && auth.role !== 'editor' && auth.role !== 'admin') {
    throw createHttpError(403, 'you are not allowed to restore revisions');
  }

  const revision = await revisionRepository.findRevision(postId, Number(revisionNumber));
  if (!revision) {
    throw createHttpError(404, 'revision not found');
  }

  postDoc.title = revision.title;
  postDoc.summary = revision.summary;
  postDoc.content = revision.content;
  postDoc.status = revision.status;
  await postRepository.savePost(postDoc);
  await snapshotPost(postDoc, auth.id);
  await auditService.record(auth.id, 'post.revision.restore', 'post', postId, {
    revisionNumber
  });
  return postDoc;
}

module.exports = { snapshotPost, listRevisions, restoreRevision };
