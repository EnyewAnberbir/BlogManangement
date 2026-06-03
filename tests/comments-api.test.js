const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const Comment = require('../appi/models/Comment');
const Post = require('../appi/models/Post');
const { createApp } = require('../appi/index');

const jwtSecret = 'comments-test-secret';
const app = createApp({
  jwtSecret,
  corsOrigin: 'http://localhost:3000',
  mongodbUri: '',
  port: 4000
});

const token = jwt.sign(
  { id: '507f1f77bcf86cd799439011', username: 'reader1', role: 'author' },
  jwtSecret
);

const originalPostFindById = Post.findById;
const originalCommentCreate = Comment.create;
const originalCommentFind = Comment.find;
const originalCommentCount = Comment.countDocuments;

test.after(() => {
  Post.findById = originalPostFindById;
  Comment.create = originalCommentCreate;
  Comment.find = originalCommentFind;
  Comment.countDocuments = originalCommentCount;
});

test('comment create requires authentication', async () => {
  const response = await request(app)
    .post('/post/507f1f77bcf86cd799439099/comments')
    .send({ body: 'Nice post' });

  assert.equal(response.status, 401);
});

test('authenticated users can create comments on existing posts', async () => {
  Post.findById = () => {
    const query = {
      populate: () => query,
      then: (resolve) => resolve({ _id: '507f1f77bcf86cd799439099', title: 'demo' })
    };
    return query;
  };

  Comment.create = async (payload) => ({
    _id: '507f1f77bcf86cd799439088',
    ...payload,
    status: 'pending'
  });

  const response = await request(app)
    .post('/post/507f1f77bcf86cd799439099/comments')
    .set('Cookie', `token=${token}`)
    .send({ body: 'Great write-up' });

  assert.equal(response.status, 201);
  assert.equal(response.body.body, 'Great write-up');
});
