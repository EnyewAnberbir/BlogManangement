const test = require('node:test');
const assert = require('node:assert/strict');
const { slugify } = require('../appi/lib/slugify');

test('slugify normalizes titles', () => {
  assert.equal(slugify('Hello World!'), 'hello-world');
  assert.equal(slugify('  Multiple   Spaces '), 'multiple-spaces');
});
