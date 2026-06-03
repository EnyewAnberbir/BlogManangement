const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MediaAssetSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    filename: { type: String, required: true, trim: true },
    path: { type: String, required: true },
    mimeType: { type: String, required: true, trim: true },
    sizeBytes: { type: Number, required: true, min: 1 },
    altText: { type: String, trim: true, maxlength: 200, default: '' },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

module.exports = model('MediaAsset', MediaAssetSchema);
