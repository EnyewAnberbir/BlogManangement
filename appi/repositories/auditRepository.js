const AuditEvent = require('../models/AuditEvent');

async function recordEvent(payload) {
  return AuditEvent.create(payload);
}

async function listRecent({ skip = 0, limit = 50 } = {}) {
  return AuditEvent.find()
    .populate('actor', ['username', 'role'])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}

async function countEvents() {
  return AuditEvent.countDocuments();
}

module.exports = { recordEvent, listRecent, countEvents };
