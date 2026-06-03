const test = require('node:test');
const assert = require('node:assert/strict');
const { buildPostSearchFilter } = require('../appi/lib/searchQuery');

test('buildPostSearchFilter returns null for empty query', () => {
  assert.equal(buildPostSearchFilter('   '), null);
});

test('buildPostSearchFilter escapes regex characters', () => {
  const filter = buildPostSearchFilter('node.js+tips');
  assert.ok(filter.$or);
  assert.equal(filter.$or[0].title.source.includes('node\\.js\\+tips'), true);
});
