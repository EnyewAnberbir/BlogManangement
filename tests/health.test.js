const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'local-test-secret';

const { createApp } = require('../appi/index');
const app = createApp();

test('GET /health returns OK payload', async () => {
  const response = await request(app).get('/health');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { ok: true });
});
