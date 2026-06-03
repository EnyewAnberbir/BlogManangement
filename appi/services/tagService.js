const tagRepository = require('../repositories/tagRepository');
const categoryRepository = require('../repositories/categoryRepository');

async function listTags() {
  return tagRepository.listTags();
}

async function listCategories() {
  return categoryRepository.listCategories();
}

module.exports = { listTags, listCategories };
