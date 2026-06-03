const Notification = require('../models/Notification');

async function createNotification(payload) {
  return Notification.create(payload);
}

async function listForUser(userId, { unreadOnly = false, skip = 0, limit = 30 } = {}) {
  const filter = { user: userId };
  if (unreadOnly) filter.readAt = null;
  return Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
}

async function countForUser(userId, unreadOnly = false) {
  const filter = { user: userId };
  if (unreadOnly) filter.readAt = null;
  return Notification.countDocuments(filter);
}

async function markRead(notificationId, userId) {
  return Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { readAt: new Date() },
    { new: true }
  );
}

async function markAllRead(userId) {
  return Notification.updateMany({ user: userId, readAt: null }, { readAt: new Date() });
}

module.exports = { createNotification, listForUser, countForUser, markRead, markAllRead };
