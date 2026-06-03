const test = require('node:test');
const assert = require('node:assert/strict');
const { parsePagination, buildPageEnvelope } = require('../appi/lib/pagination');

test('parsePagination clamps invalid page and limit', () => {
  const result = parsePagination({ page: '0', limit: '999' });
  assert.equal(result.page, 1);
  assert.equal(result.limit, 50);
});

test('buildPageEnvelope computes total pages', () => {
  const envelope = buildPageEnvelope({ page: 2, limit: 10, total: 25, items: [] });
  assert.equal(envelope.totalPages, 3);
  assert.equal(envelope.page, 2);
});
