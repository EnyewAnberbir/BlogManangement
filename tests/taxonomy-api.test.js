const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const Tag = require('../appi/models/Tag');
const Category = require('../appi/models/Category');
const { createApp } = require('../appi/index');

const app = createApp({
  jwtSecret: 'taxonomy-test-secret',
  corsOrigin: 'http://localhost:3000',
  mongodbUri: '',
  port: 4000
});

const originalTagFind = Tag.find;
const originalCategoryFind = Category.find;

test.after(() => {
  Tag.find = originalTagFind;
  Category.find = originalCategoryFind;
});

test('tags endpoint returns tag list', async () => {
  Tag.find = () => ({
    sort: async () => [{ name: 'nodejs', slug: 'nodejs' }]
  });

  const response = await request(app).get('/tags');
  assert.equal(response.status, 200);
  assert.equal(response.body[0].name, 'nodejs');
});

test('categories endpoint returns category list', async () => {
  Category.find = () => ({
    sort: async () => [{ name: 'Engineering', slug: 'engineering' }]
  });

  const response = await request(app).get('/categories');
  assert.equal(response.status, 200);
  assert.equal(response.body[0].slug, 'engineering');
});
