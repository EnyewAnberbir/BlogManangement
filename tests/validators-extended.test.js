const test = require('node:test');
const assert = require('node:assert/strict');
const {
  parseTagNames,
  parsePostStatus,
  validateCommentPayload,
  validateProfileUpdatePayload
} = require('../appi/lib/validators');

test('parseTagNames supports comma-separated strings', () => {
  assert.deepEqual(parseTagNames('node, react ,node'), ['node', 'react', 'node']);
});

test('parsePostStatus rejects invalid values', () => {
  assert.throws(() => parsePostStatus('hidden'), /invalid post status/);
});

test('validateCommentPayload enforces minimum length', () => {
  assert.throws(() => validateCommentPayload({ body: 'a' }), /too short/);
});

test('validateProfileUpdatePayload enforces bio length', () => {
  assert.throws(
    () => validateProfileUpdatePayload({ bio: 'x'.repeat(501) }),
    /bio is too long/
  );
});
