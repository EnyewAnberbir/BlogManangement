const fs = require('fs');
const path = require('path');
const { createHttpError } = require('../lib/httpError');
const { parsePagination, buildPageEnvelope } = require('../lib/pagination');
const mediaRepository = require('../repositories/mediaRepository');

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'text/plain'
]);

function persistMediaFile(file) {
  if (!file) {
    throw createHttpError(400, 'file is required');
  }
  if (!allowedMimeTypes.has(file.mimetype)) {
    throw createHttpError(400, 'unsupported media type');
  }

  const ext = path.extname(file.originalname || '') || '.bin';
  const destination = `${file.path}${ext}`;
  fs.renameSync(file.path, destination);
  return destination;
}

async function uploadMedia(auth, file, body = {}) {
  const storedPath = persistMediaFile(file);
  const tags = String(body.tags || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  return mediaRepository.createAsset({
    owner: auth.id,
    filename: file.originalname,
    path: storedPath,
    mimeType: file.mimetype,
    sizeBytes: file.size,
    altText: body.altText || '',
    tags
  });
}

async function listMedia(auth, query) {
  const { page, limit, skip } = parsePagination(query);
  const [items, total] = await Promise.all([
    mediaRepository.listForOwner(auth.id, { skip, limit }),
    mediaRepository.countForOwner(auth.id)
  ]);
  return buildPageEnvelope({ page, limit, total, items });
}

async function deleteMedia(auth, mediaId) {
  const removed = await mediaRepository.removeAsset(mediaId, auth.id);
  if (!removed) {
    throw createHttpError(404, 'media asset not found');
  }
  if (removed.path && fs.existsSync(removed.path)) {
    fs.unlinkSync(removed.path);
  }
  return { ok: true };
}

module.exports = { uploadMedia, listMedia, deleteMedia };
