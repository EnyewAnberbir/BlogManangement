const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'local-test-secret';

const { createApp } = require('../appi/index');

test('GET /profile returns 401 without auth token', async () => {
  const app = createApp();
  const response = await request(app).get('/profile');

  assert.equal(response.status, 401);
  assert.equal(response.body.error, 'authentication required');
  assert.ok(response.body.requestId);
});
