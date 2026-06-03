const Category = require('../models/Category');

async function listCategories() {
  return Category.find().sort({ name: 1 });
}

async function findById(id) {
  return Category.findById(id);
}

async function findBySlug(slug) {
  return Category.findOne({ slug });
}

module.exports = { listCategories, findById, findBySlug };
