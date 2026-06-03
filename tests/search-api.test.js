const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const Post = require('../appi/models/Post');
const { createApp } = require('../appi/index');

const app = createApp({
  jwtSecret: 'search-test-secret',
  corsOrigin: 'http://localhost:3000',
  mongodbUri: '',
  port: 4000
});

const originalPostFind = Post.find;
const originalPostCount = Post.countDocuments;

test.after(() => {
  Post.find = originalPostFind;
  Post.countDocuments = originalPostCount;
});

test('search endpoint returns empty envelope for blank query', async () => {
  const response = await request(app).get('/search/posts?q=');
  assert.equal(response.status, 200);
  assert.equal(response.body.total, 0);
  assert.deepEqual(response.body.items, []);
});

test('search endpoint returns paginated matches', async () => {
  Post.find = () => ({
    populate: () => ({
      sort: () => ({
        skip: () => ({
          limit: async () => [{ _id: '1', title: 'node tips' }]
        })
      })
    })
  });
  Post.countDocuments = async () => 1;

  const response = await request(app).get('/search/posts?q=node&page=1&limit=5');
  assert.equal(response.status, 200);
  assert.equal(response.body.total, 1);
  assert.equal(response.body.items[0].title, 'node tips');
});
