#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');

const strictMode = process.env.BOILERPLATE_STRICT === 'true';
const minCommitCount = Number(process.env.MIN_COMMIT_COUNT || (strictMode ? 50 : 10));
const minTrackedFiles = Number(process.env.MIN_TRACKED_FILES || 25);

function run(command) {
  return execSync(command, { cwd: repoRoot, encoding: 'utf8' }).trim();
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function countWords(text, terms) {
  const lower = text.toLowerCase();
  return terms.reduce((count, term) => count + (lower.includes(term) ? 1 : 0), 0);
}

function fail(message) {
  console.error(`FAILED: ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

function warn(message) {
  console.warn(`WARN: ${message}`);
}

try {
  const commitCount = Number(run('git rev-list --count HEAD'));
  const trackedFilesOutput = run('git ls-files');
  const trackedFileCount = trackedFilesOutput ? trackedFilesOutput.split(/\r?\n/).length : 0;
  const readme = readText(path.join(repoRoot, 'README.md'));

  if (!Number.isFinite(commitCount) || commitCount < minCommitCount) {
    const commitMessage =
      `Commit history is too short (${commitCount}). Minimum required: ${minCommitCount}. ` +
      'Use authentic development activity; do not fabricate history.';

    if (strictMode) {
      fail(commitMessage);
    }

    warn(commitMessage);
  }

  if (!Number.isFinite(trackedFileCount) || trackedFileCount < minTrackedFiles) {
    fail(
      `Tracked file count is too small (${trackedFileCount}). Minimum required: ${minTrackedFiles}.`
    );
  }

  const suspiciousTerms = [
    'tutorial',
    'follow-along',
    'course project',
    'assignment',
    'boilerplate',
    'starter template'
  ];

  if (countWords(readme, suspiciousTerms) >= 3) {
    fail(
      'README looks like tutorial/scaffold content. Rewrite with project-specific production context.'
    );
  }

  pass(
    `Repository cleared boilerplate filter (strictMode=${strictMode}, commits=${commitCount}, files=${trackedFileCount}).`
  );
} catch (error) {
  fail(`Unable to run boilerplate filter: ${error.message}`);
}
