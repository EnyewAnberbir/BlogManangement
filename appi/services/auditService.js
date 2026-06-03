const auditRepository = require('../repositories/auditRepository');

async function record(actorId, action, resourceType, resourceId, metadata = {}) {
  try {
    return await auditRepository.recordEvent({
      actor: actorId,
      action,
      resourceType,
      resourceId: resourceId ? String(resourceId) : undefined,
      metadata
    });
  } catch {
    return null;
  }
}

async function listAuditTrail(pagination) {
  const [items, total] = await Promise.all([
    auditRepository.listRecent(pagination),
    auditRepository.countEvents()
  ]);
  return { items, total };
}

module.exports = { record, listAuditTrail };
