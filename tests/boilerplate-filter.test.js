const test = require('node:test');
const assert = require('node:assert/strict');
const { execSync } = require('child_process');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

test('boilerplate quality filter executes', () => {
  const output = execSync('node scripts/boilerplate-filter.js', {
    cwd: repoRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      MIN_COMMIT_COUNT: '1',
      MIN_TRACKED_FILES: '1'
    }
  });

  assert.match(output, /PASS:/);
});
