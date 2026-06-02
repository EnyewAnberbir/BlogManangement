const test = require('node:test');
const assert = require('node:assert/strict');

const {
  validateRegisterPayload,
  validateLoginPayload,
  validatePostPayload,
  parsePagination
} = require('../appi/lib/validators');

test('validateRegisterPayload accepts valid payload', () => {
  const payload = validateRegisterPayload({
    username: 'validUser',
    password: 'strongPass123'
  });

  assert.equal(payload.username, 'validUser');
  assert.equal(payload.password, 'strongPass123');
});

test('validateRegisterPayload rejects short password', () => {
  assert.throws(
    () => validateRegisterPayload({ username: 'validUser', password: '123' }),
    /password must be at least 8 characters/
  );
});

test('validateLoginPayload requires username and password', () => {
  assert.throws(
    () => validateLoginPayload({ username: '', password: '' }),
    /username and password are required/
  );
});

test('validatePostPayload enforces required fields', () => {
  assert.throws(
    () => validatePostPayload({ title: 'A', summary: '', content: '' }, 'create'),
    /summary is required/
  );
});

test('parsePagination normalizes values and enforces max limit', () => {
  const pagination = parsePagination({ page: '-8', limit: '500' });
  assert.equal(pagination.page, 1);
  assert.equal(pagination.limit, 50);
  assert.equal(pagination.skip, 0);
});
