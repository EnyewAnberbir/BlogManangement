const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const request = require('supertest');

const User = require('../appi/models/User');
const Post = require('../appi/models/Post');
const { createApp } = require('../appi/index');

const jwtSecret = 'integration-test-secret';
const app = createApp({
  jwtSecret,
  corsOrigin: 'http://localhost:3000',
  mongodbUri: '',
  port: 4000
});

const originalUserFindOne = User.findOne;
const originalUserCreate = User.create;
const originalPostCreate = Post.create;
const originalPostFindById = Post.findById;
const originalPostFind = Post.find;
const originalPostCountDocuments = Post.countDocuments;

test.after(() => {
  User.findOne = originalUserFindOne;
  User.create = originalUserCreate;
  Post.create = originalPostCreate;
  Post.findById = originalPostFindById;
  Post.find = originalPostFind;
  Post.countDocuments = originalPostCountDocuments;
});

test('login and profile lifecycle returns authenticated profile', async () => {
  User.findOne = async ({ username }) => ({
    _id: '507f1f77bcf86cd799439011',
    username,
    password: bcrypt.hashSync('strongPass123', 10)
  });

  const loginResponse = await request(app)
    .post('/login')
    .send({ username: 'tester', password: 'strongPass123' });

  assert.equal(loginResponse.status, 200);
  assert.equal(loginResponse.body.username, 'tester');
  assert.ok(loginResponse.headers['set-cookie']);

  const profileResponse = await request(app)
    .get('/profile')
    .set('Cookie', loginResponse.headers['set-cookie']);

  assert.equal(profileResponse.status, 200);
  assert.equal(profileResponse.body.username, 'tester');
  assert.equal(profileResponse.body.id, '507f1f77bcf86cd799439011');
});

test('post create/update lifecycle enforces auth and ownership', async () => {
  const token = jwt.sign({ id: '507f1f77bcf86cd799439012', username: 'authorUser' }, jwtSecret);

  Post.create = async (payload) => ({
    _id: '507f1f77bcf86cd799439099',
    ...payload
  });

  const unauthorizedCreate = await request(app)
    .post('/post')
    .field('title', 'A valid title')
    .field('summary', 'This is a valid summary with enough chars')
    .field('content', 'This content has enough length to pass validation.')
    .attach('file', Buffer.from('file-content'), 'upload.txt');

  assert.equal(unauthorizedCreate.status, 401);

  const authorizedCreate = await request(app)
    .post('/post')
    .set('Cookie', `token=${token}`)
    .field('title', 'A valid title')
    .field('summary', 'This is a valid summary with enough chars')
    .field('content', 'This content has enough length to pass validation.')
    .attach('file', Buffer.from('file-content'), 'upload.txt');

  assert.equal(authorizedCreate.status, 200);
  assert.equal(authorizedCreate.body.author, '507f1f77bcf86cd799439012');

  Post.findById = () => {
    const query = {
      populate: () => query,
      then: (resolve) =>
        resolve({
          title: 't',
          summary: 's',
          content: 'c',
          cover: 'cover.png',
          author: { equals: () => false },
          save: async function save() {
            return this;
          }
        })
    };
    return query;
  };

  const forbiddenUpdate = await request(app)
    .put('/post')
    .set('Cookie', `token=${token}`)
    .field('id', '507f1f77bcf86cd799439099')
    .field('title', 'Updated title')
    .field('summary', 'Updated summary has enough characters')
    .field('content', 'Updated content has enough length to be valid');

  assert.equal(forbiddenUpdate.status, 403);
});

test('register returns 409 when username already exists', async () => {
  User.create = async () => {
    const error = new Error('duplicate key');
    error.code = 11000;
    throw error;
  };

  const response = await request(app)
    .post('/register')
    .send({ username: 'existing-user', password: 'strongPass123' });

  assert.equal(response.status, 409);
  assert.equal(response.body.error, 'username already exists');
});

test('post listing with metadata returns pagination envelope', async () => {
  Post.find = () => ({
    populate: () => ({
      sort: () => ({
        skip: () => ({
          limit: async () => [{ _id: '1', title: 'demo-post' }]
        })
      })
    })
  });
  Post.countDocuments = async () => 1;

  const response = await request(app).get('/post?withMeta=true&page=1&limit=10');

  assert.equal(response.status, 200);
  assert.equal(response.body.page, 1);
  assert.equal(response.body.limit, 10);
  assert.equal(response.body.total, 1);
  assert.equal(response.body.totalPages, 1);
  assert.equal(Array.isArray(response.body.items), true);
});
