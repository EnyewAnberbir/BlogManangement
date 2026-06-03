const { createHttpError } = require('../lib/httpError');
const { parsePagination, buildPageEnvelope } = require('../lib/pagination');
const notificationRepository = require('../repositories/notificationRepository');

async function notifyUser(userId, type, title, body, metadata = {}) {
  return notificationRepository.createNotification({
    user: userId,
    type,
    title,
    body,
    metadata
  });
}

async function listNotifications(auth, query) {
  const { page, limit, skip } = parsePagination(query);
  const unreadOnly = query.unreadOnly === 'true';

  const [items, total] = await Promise.all([
    notificationRepository.listForUser(auth.id, { unreadOnly, skip, limit }),
    notificationRepository.countForUser(auth.id, unreadOnly)
  ]);

  if (query.withMeta === 'true') {
    return buildPageEnvelope({ page, limit, total, items });
  }
  return items;
}

async function markNotificationRead(auth, notificationId) {
  const updated = await notificationRepository.markRead(notificationId, auth.id);
  if (!updated) {
    throw createHttpError(404, 'notification not found');
  }
  return updated;
}

async function markAllNotificationsRead(auth) {
  await notificationRepository.markAllRead(auth.id);
  return { ok: true };
}

module.exports = {
  notifyUser,
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead
};
