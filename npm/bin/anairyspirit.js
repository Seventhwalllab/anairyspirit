#!/usr/bin/env node
'use strict';
// `anairyspirit` from npm: see lib/core.js for what it does and does not do.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { main } = require('../lib/core.js');

const sumsFile = path.join(__dirname, '..', 'sums.json');
if (!fs.existsSync(sumsFile)) {
  process.stderr.write('anairyspirit (npm): this copy carries no release (sums.json is made when the package is built).\n');
  process.exit(1);
}
const sums = JSON.parse(fs.readFileSync(sumsFile, 'utf8'));

main(process.argv.slice(2), {
  sums,
  env: process.env,
  home: os.homedir(),
  platform: process.platform,
  arch: process.arch,
  self: __filename,
  baseUrl: process.env.ANAIRYSPIRIT_NPM_BASE_URL,
}).then(
  (code) => process.exit(code),
  (err) => {
    process.stderr.write(`anairyspirit (npm): ${err.message}\n`);
    process.exit(1);
  },
);
