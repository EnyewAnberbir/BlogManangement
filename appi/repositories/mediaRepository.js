const MediaAsset = require('../models/MediaAsset');

async function createAsset(payload) {
  return MediaAsset.create(payload);
}

async function listForOwner(ownerId, { skip = 0, limit = 40 } = {}) {
  return MediaAsset.find({ owner: ownerId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
}

async function countForOwner(ownerId) {
  return MediaAsset.countDocuments({ owner: ownerId });
}

async function findById(id) {
  return MediaAsset.findById(id);
}

async function removeAsset(id, ownerId) {
  return MediaAsset.findOneAndDelete({ _id: id, owner: ownerId });
}

module.exports = { createAsset, listForOwner, countForOwner, findById, removeAsset };
