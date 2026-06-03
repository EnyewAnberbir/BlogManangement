const Tag = require('../models/Tag');

async function listTags() {
  return Tag.find().sort({ name: 1 });
}

async function findOrCreateByNames(names) {
  const normalized = [...new Set(names.map((name) => String(name).trim()).filter(Boolean))];
  const tags = [];

  for (const name of normalized) {
    let tag = await Tag.findOne({ name });
    if (!tag) {
      tag = await Tag.create({ name });
    }
    tags.push(tag);
  }

  return tags;
}

async function findBySlug(slug) {
  return Tag.findOne({ slug });
}

module.exports = { listTags, findOrCreateByNames, findBySlug };
