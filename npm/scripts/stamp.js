'use strict';
// node scripts/stamp.js <version> <SHA256SUMS>
//
// Run by .github/workflows/npm-release.yml after it has checked the release's
// SHA256SUMS against its GPG signature (key in KEYS): writes sums.json — the
// version and the sha256 of the three archives the launcher may download — and
// sets that version in package.json. Refuses when an archive is missing.
const fs = require('fs');
const path = require('path');

const [version, sumsPath] = process.argv.slice(2);
if (!/^\d+\.\d+\.\d+$/.test(version || '') || !sumsPath) {
  console.error('usage: node scripts/stamp.js <X.Y.Z> <SHA256SUMS>');
  process.exit(2);
}
const lines = fs.readFileSync(sumsPath, 'utf8').split('\n');
const want = [
  `anairyspirit-${version}-macos-universal.tar.gz`,
  `anairyspirit-${version}-x86_64.tar.gz`,
  `anairyspirit-${version}-arm64.tar.gz`,
];
const files = {};
for (const line of lines) {
  const m = /^([0-9a-f]{64})\s+\*?(\S+)$/.exec(line.trim());
  if (m && want.includes(m[2])) files[m[2]] = m[1];
}
const missing = want.filter((f) => !files[f]);
if (missing.length) {
  console.error(`✗ SHA256SUMS has no line for: ${missing.join(', ')}`);
  process.exit(1);
}
const root = path.join(__dirname, '..');
fs.writeFileSync(path.join(root, 'sums.json'), `${JSON.stringify({ version, files }, null, 2)}\n`);
const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.version = version;
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
console.log(`✓ anairyspirit ${version}: ${Object.keys(files).length} archives`);
