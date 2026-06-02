const test = require('node:test');
const assert = require('node:assert/strict');

const { getConfig } = require('../appi/config');

test('getConfig returns normalized runtime configuration', () => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.PORT = '4321';
  process.env.CORS_ORIGIN = 'http://localhost:9000';
  process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';

  const config = getConfig();
  assert.equal(config.jwtSecret, 'test-secret');
  assert.equal(config.port, 4321);
  assert.equal(config.corsOrigin, 'http://localhost:9000');
  assert.equal(config.mongodbUri, 'mongodb://localhost:27017/test-db');
});

test('getConfig throws when JWT_SECRET is missing', () => {
  const previousSecret = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;

  assert.throws(() => getConfig(), /JWT_SECRET/);

  process.env.JWT_SECRET = previousSecret;
});
