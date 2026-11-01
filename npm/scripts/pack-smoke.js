#!/usr/bin/env node
'use strict';
// The package as a person gets it, on a machine without anairyspirit:
// `npm pack`, then `npx -y --package=<that tarball> <its bin> mcp` in an empty folder, and an MCP
// client's first two questions — `initialize`, `tools/list`. The answer must be
// the one tool `setup_required`.
//
// Unit tests (`npm test`) call the launcher's functions; they cannot see what
// npm itself does with package.json before our code runs. That is where the
// 0.1.440 package failed on Windows: `"os": ["darwin","linux"]` made npm refuse
// it with EBADPLATFORM, and the MCP client saw a server that died before
// `initialize` (public install paths check, 28.10.2026). Run on each platform a
// release is built for, on the very tarball the registry then gets.
//
// Usage: node npm/scripts/pack-smoke.js [<tarball or folder with one>]

const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const pkgDir = path.resolve(__dirname, '..');
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'as-pack-smoke-'));

function fail(msg) {
  console.error(`✗ pack-smoke: ${msg}`);
  process.exit(1);
}

// With an argument — a tarball or a folder holding one — that package is run
// as it is (the release workflow passes the one it then sends to the registry);
// without, the package in this folder is packed first.
let tarball;
const arg = process.argv[2];
if (arg) {
  const a = path.resolve(arg);
  tarball = fs.statSync(a).isDirectory()
    ? path.join(a, fs.readdirSync(a).find((f) => f.endsWith('.tgz')) || fail(`no .tgz in ${a}`))
    : a;
} else {
  const pack = spawnSync('npm', ['pack', '--pack-destination', work], { cwd: pkgDir, encoding: 'utf8' });
  if (pack.status !== 0) fail(`npm pack: ${pack.stderr || pack.stdout}`);
  const f = fs.readdirSync(work).find((n) => n.endsWith('.tgz'));
  if (!f) fail('npm pack wrote no tarball');
  tarball = path.join(work, f);
}
const tgz = path.basename(tarball);

const run = path.join(work, 'run');
fs.mkdirSync(run);
// A tarball is given as `--package`; the command is the package's one bin —
// what `npx -y anairyspirit mcp` resolves to from the registry.
const bin = Object.keys(require(path.join(pkgDir, 'package.json')).bin)[0];
const child = spawn('npx', ['-y', `--package=${tarball}`, bin, 'mcp'], {
  cwd: run,
  stdio: ['pipe', 'pipe', 'pipe'],
});

let out = '';
let err = '';
child.stdout.on('data', (d) => { out += d; check(); });
child.stderr.on('data', (d) => { err += d; });
child.on('exit', (code) => {
  if (!done) fail(`the server exited (${code}) before answering.\nstdout: ${out}\nstderr: ${err}`);
});

const timer = setTimeout(() => fail(`no answer in 180 s.\nstdout: ${out}\nstderr: ${err}`), 180000);

const send = (m) => child.stdin.write(`${JSON.stringify(m)}\n`);
send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'pack-smoke', version: '1' } } });
send({ jsonrpc: '2.0', method: 'notifications/initialized' });
send({ jsonrpc: '2.0', id: 2, method: 'tools/list' });

let done = false;
function check() {
  const msgs = out.split('\n').filter((l) => l.trim()).map((l) => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
  const init = msgs.find((m) => m.id === 1);
  const list = msgs.find((m) => m.id === 2);
  if (!init || !list) return;
  done = true;
  clearTimeout(timer);
  child.stdin.end();
  if (!init.result || !init.result.protocolVersion) fail(`initialize: ${JSON.stringify(init)}`);
  const tools = (list.result && list.result.tools) || [];
  if (tools.length !== 1 || tools[0].name !== 'setup_required') {
    fail(`tools/list: ${JSON.stringify(list)}`);
  }
  console.log(`✓ pack-smoke on ${process.platform}/${process.arch}: ${tgz} answers initialize, one tool setup_required`);
  process.exit(0);
}
