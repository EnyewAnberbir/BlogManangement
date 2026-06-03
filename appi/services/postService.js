const fs = require('fs');
const { createHttpError } = require('../lib/httpError');
const { parsePagination, buildPageEnvelope } = require('../lib/pagination');
const { buildPostSearchFilter } = require('../lib/searchQuery');
const postRepository = require('../repositories/postRepository');
const tagRepository = require('../repositories/tagRepository');
const categoryRepository = require('../repositories/categoryRepository');
const auditService = require('./auditService');
const { validatePostPayload, parseTagNames, parsePostStatus } = require('../lib/validators');

function isPostAuthor(postDoc, authId) {
  const author = postDoc.author;
  if (author && typeof author.equals === 'function') {
    return author.equals(authId);
  }
  const authorRef = author?._id || author;
  return Boolean(authorRef && authorRef.equals(authId));
}

function persistUploadedFile(file) {
  if (!file) {
    throw createHttpError(400, 'file is required');
  }

  const { originalname, path: uploadPath } = file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = `${uploadPath}.${ext}`;
  fs.renameSync(uploadPath, newPath);
  return newPath;
}

async function resolveTags(rawTags) {
  const names = parseTagNames(rawTags);
  if (!names.length) return [];
  const tags = await tagRepository.findOrCreateByNames(names);
  return tags.map((tag) => tag._id);
}

async function resolveCategory(categoryId) {
  if (!categoryId) return undefined;
  const category = await categoryRepository.findById(categoryId);
  if (!category) {
    throw createHttpError(400, 'invalid category');
  }
  return category._id;
}

async function createPost(auth, body, file) {
  const { title, summary, content } = validatePostPayload(body, 'create');
  const status = parsePostStatus(body.status, 'draft');
  const cover = persistUploadedFile(file);
  const tags = await resolveTags(body.tags);
  const category = await resolveCategory(body.categoryId);

  const postDoc = await postRepository.createPost({
    title,
    summary,
    content,
    cover,
    author: auth.id,
    status,
    tags,
    category
  });

  await auditService.record(auth.id, 'post.create', 'post', postDoc._id, { status });
  return postDoc;
}

async function updatePost(auth, body, file) {
  const { id, title, summary, content } = validatePostPayload(body, 'update');
  const postDoc = await postRepository.findPostById(id);

  if (!postDoc) {
    throw createHttpError(404, 'post not found');
  }
  if (!isPostAuthor(postDoc, auth.id) && auth.role !== 'editor' && auth.role !== 'admin') {
    throw createHttpError(403, 'you are not the author');
  }

  let coverPath = postDoc.cover;
  if (file) {
    coverPath = persistUploadedFile(file);
  }

  postDoc.title = title;
  postDoc.summary = summary;
  postDoc.content = content;
  postDoc.cover = coverPath;

  if (body.status) {
    postDoc.status = parsePostStatus(body.status, postDoc.status);
  }
  if (body.tags !== undefined) {
    postDoc.tags = await resolveTags(body.tags);
  }
  if (body.categoryId !== undefined) {
    postDoc.category = await resolveCategory(body.categoryId);
  }

  await postRepository.savePost(postDoc);
  await auditService.record(auth.id, 'post.update', 'post', postDoc._id);
  return postDoc;
}

async function publishPost(auth, postId) {
  const postDoc = await postRepository.findPostById(postId);
  if (!postDoc) throw createHttpError(404, 'post not found');
  if (!isPostAuthor(postDoc, auth.id) && auth.role !== 'editor' && auth.role !== 'admin') {
    throw createHttpError(403, 'you are not the author');
  }
  postDoc.status = 'published';
  await postRepository.savePost(postDoc);
  await auditService.record(auth.id, 'post.publish', 'post', postDoc._id);
  return postDoc;
}

async function listPosts(query) {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.status) {
    filter.status = parsePostStatus(query.status, 'published');
  } else if (query.includeDrafts !== 'true') {
    filter.status = 'published';
  }

  if (query.authorId) {
    filter.author = query.authorId;
  }

  if (query.tag) {
    const tag = await tagRepository.findBySlug(query.tag);
    if (!tag) {
      return buildPageEnvelope({ page, limit, total: 0, items: [] });
    }
    filter.tags = tag._id;
  }

  if (query.category) {
    const category = await categoryRepository.findBySlug(query.category);
    if (!category) {
      return buildPageEnvelope({ page, limit, total: 0, items: [] });
    }
    filter.category = category._id;
  }

  const searchFilter = buildPostSearchFilter(query.q);
  if (searchFilter) {
    Object.assign(filter, searchFilter);
  }

  const [items, total] = await Promise.all([
    postRepository.listPosts({ filter, skip, limit }),
    postRepository.countPosts(filter)
  ]);

  if (query.withMeta === 'true') {
    return buildPageEnvelope({ page, limit, total, items });
  }

  return items;
}

async function getPostById(id, { trackView = false } = {}) {
  const postDoc = await postRepository.findPostById(id);
  if (!postDoc) {
    throw createHttpError(404, 'post not found');
  }
  if (trackView) {
    await postRepository.incrementViewCount(id);
    postDoc.viewCount += 1;
  }
  return postDoc;
}

module.exports = {
  createPost,
  updatePost,
  publishPost,
  listPosts,
  getPostById
};
