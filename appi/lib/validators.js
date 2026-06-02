const { createHttpError } = require('./httpError');

function ensureString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateRegisterPayload(body) {
  const username = ensureString(body.username);
  const password = ensureString(body.password);

  if (username.length < 4) {
    throw createHttpError(400, 'username must be at least 4 characters');
  }
  if (password.length < 8) {
    throw createHttpError(400, 'password must be at least 8 characters');
  }

  return { username, password };
}

function validateLoginPayload(body) {
  const username = ensureString(body.username);
  const password = ensureString(body.password);

  if (!username || !password) {
    throw createHttpError(400, 'username and password are required');
  }

  return { username, password };
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

function parsePagination(query) {
  const rawPage = Number(query.page || 1);
  const rawLimit = Number(query.limit || 20);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(Math.floor(rawLimit), 50) : 20;

  return { page, limit, skip: (page - 1) * limit };
}

module.exports = {
  validateRegisterPayload,
  validateLoginPayload,
  validatePostPayload,
  parsePagination
};
