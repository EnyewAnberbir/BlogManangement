const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const NewsletterSubscriber = require('../appi/models/NewsletterSubscriber');
const { createApp } = require('../appi/index');

const app = createApp({
  jwtSecret: 'newsletter-test-secret',
  corsOrigin: 'http://localhost:3000',
  mongodbUri: '',
  port: 4000
});

const originalFindOne = NewsletterSubscriber.findOne;
const originalCreate = NewsletterSubscriber.create;

test.after(() => {
  NewsletterSubscriber.findOne = originalFindOne;
  NewsletterSubscriber.create = originalCreate;
});

test('newsletter subscribe validates email', async () => {
  const response = await request(app)
    .post('/newsletter/subscribe')
    .send({ email: 'not-an-email' });
  assert.equal(response.status, 400);
});

test('newsletter subscribe creates subscriber', async () => {
  NewsletterSubscriber.findOne = async () => null;
  NewsletterSubscriber.create = async (payload) => ({ _id: '1', ...payload });

  const response = await request(app)
    .post('/newsletter/subscribe')
    .send({ email: 'reader@example.com' });

  assert.equal(response.status, 201);
  assert.equal(response.body.email, 'reader@example.com');
});
