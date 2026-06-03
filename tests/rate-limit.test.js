const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const request = require('supertest');
const { createRateLimiter, resetRateLimitBuckets } = require('../appi/middleware/rateLimit');

test.after(() => {
  resetRateLimitBuckets();
});

test('rate limiter blocks excessive requests', async () => {
  const app = express();
  const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 2 });

  app.get('/limited', limiter, (_req, res) => {
    res.json({ ok: true });
  });

  assert.equal((await request(app).get('/limited')).status, 200);
  assert.equal((await request(app).get('/limited')).status, 200);
  assert.equal((await request(app).get('/limited')).status, 429);
});
