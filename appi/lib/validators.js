const { createHttpError } = require('./httpError');

function ensureString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateRegisterPayload(body) {
  const username = ensureString(body.username);
  const password = ensureString(body.password);
  const displayName = ensureString(body.displayName);

  if (username.length < 4) {
    throw createHttpError(400, 'username must be at least 4 characters');
  }
  if (password.length < 8) {
    throw createHttpError(400, 'password must be at least 8 characters');
  }

  return { username, password, displayName };
}

function validateLoginPayload(body) {
  const username = ensureString(body.username);
  const password = ensureString(body.password);

  if (!username || !password) {
    throw createHttpError(400, 'username and password are required');
  }

  return { username, password };
}

function validateProfileUpdatePayload(body) {
  const displayName = body.displayName === undefined ? undefined : ensureString(body.displayName);
  const bio = body.bio === undefined ? undefined : ensureString(body.bio);

  if (displayName !== undefined && displayName.length > 80) {
    throw createHttpError(400, 'displayName is too long');
  }
  if (bio !== undefined && bio.length > 500) {
    throw createHttpError(400, 'bio is too long');
  }

  return { displayName, bio };
}

function validatePostPayload(body, mode = 'create') {
  const title = ensureString(body.title);
  const summary = ensureString(body.summary);
  const content = ensureString(body.content);
  const id = ensureString(body.id);

  if (mode === 'update' && !id) {
    throw createHttpError(400, 'post id is required');
  }
  if (!title) {
    throw createHttpError(400, 'title is required');
  }
  if (!summary) {
    throw createHttpError(400, 'summary is required');
  }
  if (!content) {
    throw createHttpError(400, 'content is required');
  }

  return { id, title, summary, content };
}

function validateCommentPayload(body) {
  const commentBody = ensureString(body.body);
  if (commentBody.length < 2) {
    throw createHttpError(400, 'comment body is too short');
  }
  return { body: commentBody };
}

function parseTagNames(rawTags) {
  if (!rawTags) return [];
  if (Array.isArray(rawTags)) {
    return rawTags.map((tag) => ensureString(tag)).filter(Boolean);
  }
  return ensureString(rawTags)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

const allowedStatuses = ['draft', 'published', 'archived'];

function parsePostStatus(rawStatus, fallback = 'published') {
  const status = ensureString(rawStatus) || fallback;
  if (!allowedStatuses.includes(status)) {
    throw createHttpError(400, 'invalid post status');
  }
  return status;
}

module.exports = {
  validateRegisterPayload,
  validateLoginPayload,
  validateProfileUpdatePayload,
  validatePostPayload,
  validateCommentPayload,
  parseTagNames,
  parsePostStatus,
  parsePagination: require('./pagination').parsePagination
};
