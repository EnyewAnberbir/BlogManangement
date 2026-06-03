const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PostRevisionSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    editor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published', 'archived'], required: true },
    revisionNumber: { type: Number, required: true, min: 1 }
  },
  { timestamps: true }
);

PostRevisionSchema.index({ post: 1, revisionNumber: -1 }, { unique: true });

module.exports = model('PostRevision', PostRevisionSchema);
