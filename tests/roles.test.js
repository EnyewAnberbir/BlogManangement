const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const request = require('supertest');
const { requireRole } = require('../appi/middleware/requireRole');
const { createHttpError } = require('../appi/lib/httpError');

function buildRoleApp(role) {
  const app = express();
  app.get(
    '/secure',
    (req, _res, next) => {
      req.auth = { id: '1', username: 'user', role };
      next();
    },
    requireRole('editor'),
    (_req, res) => {
      res.json({ ok: true });
    }
  );
  app.use((err, _req, res, _next) => {
    res.status(err.statusCode || 500).json({ error: err.message });
  });
  return app;
}

test('requireRole allows editor and admin', async () => {
  assert.equal((await request(buildRoleApp('editor')).get('/secure')).status, 200);
  assert.equal((await request(buildRoleApp('admin')).get('/secure')).status, 200);
});

test('requireRole rejects author role', async () => {
  const response = await request(buildRoleApp('author')).get('/secure');
  assert.equal(response.status, 403);
  assert.equal(response.body.error, 'insufficient role');
});

test('createHttpError exposes client-safe messages by default', () => {
  const error = createHttpError(400, 'bad input');
  assert.equal(error.expose, true);
  assert.equal(error.statusCode, 400);
});
