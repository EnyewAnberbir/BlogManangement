const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const AuditEventSchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true, trim: true, maxlength: 80 },
    resourceType: { type: String, required: true, trim: true, maxlength: 40 },
    resourceId: { type: String, trim: true, maxlength: 64 },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

AuditEventSchema.index({ createdAt: -1 });

module.exports = model('AuditEvent', AuditEventSchema);
