#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

const checks = [
  {
    name: 'format-check',
    command: 'npm run format:check'
  },
  {
    name: 'lint',
    command: 'npm run lint'
  },
  {
    name: 'tests',
    command: 'npm test'
  },
  {
    name: 'boilerplate-strict',
    command:
      "powershell -Command \"$env:BOILERPLATE_STRICT='true'; node scripts/boilerplate-filter.js\""
  }
];

function runCheck({ name, command }) {
  process.stdout.write(`\n=== ${name} ===\n`);
  execSync(command, {
    cwd: repoRoot,
    stdio: 'inherit'
  });
}

try {
  checks.forEach(runCheck);
  process.stdout.write('\nAll readiness checks passed.\n');
} catch (error) {
  process.stderr.write('\nReadiness checks failed.\n');
  process.exit(error.status || 1);
}
