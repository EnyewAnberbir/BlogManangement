#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const sourceExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.py', '.go', '.rs', '.java']);
const excludedPathParts = [
  'node_modules',
  'coverage',
  'dist',
  'build',
  '.git',
  'uploads',
  'package-lock.json'
];

const minProductionLoc = Number(process.env.MIN_PRODUCTION_LOC || 5000);
const minProductionFiles = Number(process.env.MIN_PRODUCTION_FILES || 60);

function isExcluded(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  if (excludedPathParts.some((part) => normalized.includes(`/${part}/`) || normalized.endsWith(`/${part}`))) {
    return true;
  }
  if (normalized.includes('/tests/') || normalized.startsWith('tests/')) return true;
  if (normalized.endsWith('.test.js') || normalized.endsWith('.spec.js')) return true;
  return false;
}

function countLines(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  return text.split(/\r?\n/).length;
}

function analyze(files) {
  let productionLoc = 0;
  let productionFiles = 0;
  let testLoc = 0;
  let testFiles = 0;

  for (const relativePath of files) {
    const ext = path.extname(relativePath);
    if (!sourceExtensions.has(ext)) continue;

    const absolutePath = path.join(repoRoot, relativePath);
    if (!fs.existsSync(absolutePath)) continue;

    const lines = countLines(absolutePath);
    if (isExcluded(relativePath)) {
      testLoc += lines;
      testFiles += 1;
    } else {
      productionLoc += lines;
      productionFiles += 1;
    }
  }

  return { productionLoc, productionFiles, testLoc, testFiles };
}

function main() {
  const tracked = execSync('git ls-files', { cwd: repoRoot, encoding: 'utf8' })
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  const untracked = execSync('git ls-files --others --exclude-standard', {
    cwd: repoRoot,
    encoding: 'utf8'
  })
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  const files = [...new Set([...tracked, ...untracked])];
  if (untracked.length) {
    console.warn(`WARN: ${untracked.length} untracked source files will not be in zip until committed.`);
  }
  const commits = Number(execSync('git rev-list --count HEAD', { cwd: repoRoot, encoding: 'utf8' }).trim());
  const metrics = analyze(files);

  console.log('Silver source metrics (local estimate)');
  console.log(`  commits: ${commits}`);
  console.log(`  production files: ${metrics.productionFiles}`);
  console.log(`  production LOC: ${metrics.productionLoc}`);
  console.log(`  test files: ${metrics.testFiles}`);
  console.log(`  test LOC: ${metrics.testLoc}`);
  console.log(`  thresholds: >=${minProductionFiles} files, >=${minProductionLoc} LOC`);

  const fileOk = metrics.productionFiles >= minProductionFiles;
  const locOk = metrics.productionLoc >= minProductionLoc;

  if (!fileOk || !locOk) {
    console.error('FAILED: production code volume is below recommended Silver thresholds.');
    process.exit(1);
  }

  console.log('PASS: production code volume meets local Silver thresholds.');
}

main();
