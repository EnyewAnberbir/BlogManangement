const { createHttpError } = require('../lib/httpError');
const newsletterRepository = require('../repositories/newsletterRepository');
const auditService = require('./auditService');

function validateEmail(email) {
  const normalized = String(email || '')
    .trim()
    .toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw createHttpError(400, 'invalid email address');
  }
  return normalized;
}

async function subscribe(email, source = 'web') {
  const normalized = validateEmail(email);
  const subscriber = await newsletterRepository.subscribe(normalized, source);
  return subscriber;
}

async function unsubscribe(email) {
  const normalized = validateEmail(email);
  const subscriber = await newsletterRepository.unsubscribe(normalized);
  if (!subscriber) {
    throw createHttpError(404, 'subscriber not found');
  }
  return subscriber;
}

async function getNewsletterStats(auth) {
  if (auth.role !== 'admin' && auth.role !== 'editor') {
    throw createHttpError(403, 'insufficient role');
  }
  const active = await newsletterRepository.countActive();
  return { activeSubscribers: active };
}

async function exportAudience(auth) {
  if (auth.role !== 'admin') {
    throw createHttpError(403, 'insufficient role');
  }
  const subscribers = await newsletterRepository.listActive({ limit: 500 });
  await auditService.record(auth.id, 'newsletter.export', 'newsletter', 'all', {
    count: subscribers.length
  });
  return subscribers.map((entry) => entry.email);
}

module.exports = { subscribe, unsubscribe, getNewsletterStats, exportAudience };
