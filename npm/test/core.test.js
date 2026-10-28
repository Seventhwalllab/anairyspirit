'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const { PassThrough } = require('stream');
const core = require('../lib/core.js');
const notice = require('../lib/notice.js');

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'as-npm-test-'));
}

// A stand-in for the real program: a shell script is not a Node launcher.
function fakeProgram(dir, body) {
  const f = path.join(dir, 'anairyspirit');
  fs.writeFileSync(f, `#!/bin/sh\n${body}\n`);
  fs.chmodSync(f, 0o755);
  return f;
}

test('archiveFor: macOS universal (flat), Linux per arch, nothing elsewhere', () => {
  assert.deepStrictEqual(core.archiveFor('darwin', 'arm64', '1.2.3'),
    { file: 'anairyspirit-1.2.3-macos-universal.tar.gz', dir: '' });
  assert.deepStrictEqual(core.archiveFor('darwin', 'x64', '1.2.3').file, 'anairyspirit-1.2.3-macos-universal.tar.gz');
  assert.deepStrictEqual(core.archiveFor('linux', 'x64', '1.2.3'),
    { file: 'anairyspirit-1.2.3-x86_64.tar.gz', dir: 'anairyspirit-1.2.3-x86_64' });
  assert.strictEqual(core.archiveFor('linux', 'arm64', '1.2.3').file, 'anairyspirit-1.2.3-arm64.tar.gz');
  assert.strictEqual(core.archiveFor('linux', 'ia32', '1.2.3'), null);
  assert.strictEqual(core.archiveFor('win32', 'x64', '1.2.3'), null);
});

test('versions: parsed from --version output and compared', () => {
  assert.deepStrictEqual(core.parseVersion('Anairyspirit v0.1.391\n'), [0, 1, 391]);
  assert.strictEqual(core.parseVersion('no version'), null);
  assert.strictEqual(core.compareVersions([0, 1, 390], [0, 1, 391]), -1);
  assert.strictEqual(core.compareVersions([0, 2, 0], [0, 1, 391]), 1);
  assert.strictEqual(core.compareVersions([0, 1, 391], [0, 1, 391]), 0);
});

test('findInstalled: skips this launcher and any Node launcher, finds the program', () => {
  const home = tmpdir();
  const a = tmpdir();
  const b = tmpdir();
  const self = path.join(a, 'anairyspirit');
  fs.writeFileSync(self, '#!/usr/bin/env node\n');
  fs.chmodSync(self, 0o755);
  const other = path.join(b, 'anairyspirit');
  fs.writeFileSync(other, '#!/usr/bin/env node\n// another npm prefix\n');
  fs.chmodSync(other, 0o755);
  const env = { PATH: [a, b].join(path.delimiter) };
  // Only launchers on PATH and no usual places → nothing installed.
  assert.strictEqual(core.findInstalled(env, home, self, []), null);
  const c = tmpdir();
  const prog = fakeProgram(c, 'echo "Anairyspirit v0.1.1"');
  const env2 = { PATH: [a, b, c].join(path.delimiter) };
  assert.strictEqual(core.findInstalled(env2, home, self, []), prog);
});

function serve(files) {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const name = decodeURIComponent(req.url.split('/').pop());
      if (files[name]) { res.writeHead(200); res.end(files[name]); } else { res.writeHead(404); res.end(); }
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

function makeArchive(version) {
  // A Linux-shaped archive: one top directory with a program in it.
  const work = tmpdir();
  const top = `anairyspirit-${version}-x86_64`;
  fs.mkdirSync(path.join(work, top));
  fakeProgram(path.join(work, top), `echo "Anairyspirit v${version}"; echo "args:$*"; pwd`);
  const out = path.join(tmpdir(), `${top}.tar.gz`);
  const r = spawnSync('tar', ['-czf', out, '-C', work, top]);
  assert.strictEqual(r.status, 0);
  return fs.readFileSync(out);
}

test('fetchRelease: unpacks only when the sha256 matches', async () => {
  const version = '9.9.9';
  const file = `anairyspirit-${version}-x86_64.tar.gz`;
  const bytes = makeArchive(version);
  const sha = crypto.createHash('sha256').update(bytes).digest('hex');
  const srv = await serve({ [file]: bytes });
  const baseUrl = `http://127.0.0.1:${srv.address().port}`;
  const opts = { platform: 'linux', arch: 'x64', baseUrl, log: () => {} };
  try {
    const good = await core.fetchRelease({ version, files: { [file]: sha } }, opts);
    assert.ok(fs.existsSync(good.program));
    fs.rmSync(good.tmp, { recursive: true, force: true });
    await assert.rejects(
      core.fetchRelease({ version, files: { [file]: '0'.repeat(64) } }, opts),
      /nothing was installed/,
    );
    await assert.rejects(core.fetchRelease({ version, files: {} }, opts), /no checksum/);
  } finally {
    srv.close();
  }
});

test('main: an installed program gets every command', async () => {
  const home = tmpdir();
  const c = tmpdir();
  const marker = path.join(tmpdir(), 'got');
  fakeProgram(c, `echo "$*" > "${marker}"`);
  const code = await core.main(['mcp', '--x'], {
    sums: { version: '0.1.391', files: {} }, env: { PATH: c }, home,
    platform: 'linux', arch: 'x64', self: '/nonexistent/launcher.js', log: () => {}, extraDirs: [],
  });
  assert.strictEqual(code, 0);
  assert.strictEqual(fs.readFileSync(marker, 'utf8').trim(), 'mcp --x');
});

test('main: update hands the newer release to `update --from`; same version does nothing', async () => {
  const version = '9.9.9';
  const file = `anairyspirit-${version}-x86_64.tar.gz`;
  const bytes = makeArchive(version);
  const sha = crypto.createHash('sha256').update(bytes).digest('hex');
  const srv = await serve({ [file]: bytes });
  const baseUrl = `http://127.0.0.1:${srv.address().port}`;
  const home = tmpdir();
  const c = tmpdir();
  const marker = path.join(tmpdir(), 'got');
  fakeProgram(c, `if [ "$1" = --version ]; then echo "Anairyspirit v0.1.1"; else echo "$*" > "${marker}"; fi`);
  const base = { env: { PATH: c }, home, platform: 'linux', arch: 'x64', self: '/nonexistent/launcher.js', baseUrl, log: () => {}, extraDirs: [] };
  try {
    const code = await core.main(['update'], { ...base, sums: { version, files: { [file]: sha } } });
    assert.strictEqual(code, 0);
    assert.match(fs.readFileSync(marker, 'utf8'), /^update --from .*anairyspirit-9\.9\.9-x86_64\/anairyspirit$/m);
    fs.rmSync(marker);
    const same = await core.main(['update'], { ...base, sums: { version: '0.1.1', files: {} } });
    assert.strictEqual(same, 0);
    assert.ok(!fs.existsSync(marker));
  } finally {
    srv.close();
  }
});

test('main: nothing installed and a command other than setup or mcp → a clear refusal', async () => {
  const lines = [];
  const code = await core.main(['status'], {
    sums: { version: '0.1.391', files: {} }, env: { PATH: tmpdir() }, home: tmpdir(),
    platform: 'linux', arch: 'x64', self: '/nonexistent/launcher.js', log: (m) => lines.push(m), extraDirs: [],
  });
  assert.strictEqual(code, 1);
  assert.match(lines.join('\n'), /npx anairyspirit setup/);
});

test('notice: initialize, tools/list, tools/call; notifications get no answer', () => {
  const v = '0.1.391';
  const init = notice.respond({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26' } }, v);
  assert.strictEqual(init.result.protocolVersion, '2025-03-26');
  assert.deepStrictEqual(init.result.serverInfo, { name: 'anairyspirit', version: v });
  assert.deepStrictEqual(init.result.capabilities, { tools: {} });
  const unknown = notice.respond({ jsonrpc: '2.0', id: 2, method: 'initialize', params: { protocolVersion: '1999-01-01' } }, v);
  assert.strictEqual(unknown.result.protocolVersion, notice.PROTOCOL_VERSIONS[0]);
  assert.strictEqual(notice.respond({ jsonrpc: '2.0', method: 'notifications/initialized' }, v), null);
  const list = notice.respond({ jsonrpc: '2.0', id: 3, method: 'tools/list' }, v);
  assert.deepStrictEqual(list.result.tools.map((t) => t.name), [notice.TOOL]);
  const call = notice.respond({ jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: notice.TOOL, arguments: {} } }, v);
  assert.strictEqual(call.result.isError, false);
  assert.match(call.result.content[0].text, /npx anairyspirit setup/);
  assert.match(call.result.content[0].text, /v0\.1\.391/);
  assert.strictEqual(notice.respond({ jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'search' } }, v).error.code, -32602);
  assert.strictEqual(notice.respond({ jsonrpc: '2.0', id: 6, method: 'resources/list' }, v).error.code, -32601);
  assert.deepStrictEqual(notice.respond({ jsonrpc: '2.0', id: 7, method: 'ping' }, v).result, {});
});

test('main: nothing installed and `mcp` → answers MCP over stdio until stdin closes', async () => {
  const stdin = new PassThrough();
  const stdout = new PassThrough();
  let out = '';
  stdout.on('data', (c) => { out += c; });
  const lines = [];
  const done = core.main(['mcp'], {
    sums: { version: '0.1.391', files: {} }, env: { PATH: tmpdir() }, home: tmpdir(),
    platform: 'linux', arch: 'x64', self: '/nonexistent/launcher.js', log: (m) => lines.push(m), extraDirs: [],
    stdin, stdout,
  });
  stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18' } })}\n`);
  stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })}\n`);
  stdin.write('not json\n');
  stdin.end(`${JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list' })}\n`);
  assert.strictEqual(await done, 0);
  const msgs = out.trim().split('\n').map((l) => JSON.parse(l));
  assert.deepStrictEqual(msgs.map((m) => m.id), [1, null, 2]);
  assert.strictEqual(msgs[0].result.protocolVersion, '2025-06-18');
  assert.strictEqual(msgs[1].error.code, -32700);
  assert.deepStrictEqual(msgs[2].result.tools.map((t) => t.name), [notice.TOOL]);
  // The refusal still goes to stderr, never into the MCP stream.
  assert.match(lines.join('\n'), /npx anairyspirit setup/);
});

test('main: an unsupported platform says so', async () => {
  const lines = [];
  const code = await core.main([], {
    sums: { version: '0.1.391', files: {} }, env: {}, home: tmpdir(),
    platform: 'win32', arch: 'x64', self: '/x', log: (m) => lines.push(m), extraDirs: [],
  });
  assert.strictEqual(code, 1);
  assert.match(lines.join('\n'), /macOS and on Linux/);
});
