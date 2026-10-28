'use strict';
// The npm package of anairyspirit is an installer and a launcher, not the
// program: it carries no binary. It knows one release — the version in
// sums.json, with the sha256 of that release's archives, taken from the
// release's GPG-signed SHA256SUMS when the package was built — and does three
// things:
//
//   * nothing installed yet: `anairyspirit` / `anairyspirit setup` downloads
//     the archive for this machine from the GitHub release, checks its sha256,
//     unpacks it and runs `./anairyspirit setup` from it — the same install as
//     from the archive by hand; `anairyspirit mcp` answers MCP with one tool
//     that tells the agent the user has to run `npx anairyspirit setup`
//     (lib/notice.js) — an MCP client sees a server that explains, not one
//     that does not start;
//   * installed (any way — disk image, Homebrew, .deb/.rpm, archive): every
//     command goes to the installed program, so `npx -y anairyspirit mcp`
//     works in an MCP client's configuration;
//   * `anairyspirit update`: when the installed program is older than this
//     package's release, downloads and checks that release and hands it to
//     `anairyspirit update --from`, the program's own update.
//
// Its one command is `anairyspirit-npm`, never `anairyspirit`: `npm i -g` puts
// its commands into npm's bin folder — /usr/local/bin, /opt/homebrew/bin or
// /usr/bin — and `setup` installs the program as /usr/local/bin/anairyspirit
// (or ~/.local/bin). Under one name the copy would write through npm's link
// into this package, and in /usr/bin the program would take itself for a
// system package. `npx anairyspirit …` still runs it: npx runs a package's
// only command whatever its name.

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const http = require('http');
const https = require('https');
const { spawn, spawnSync } = require('child_process');
const notice = require('./notice.js');

const RELEASES = 'https://github.com/Seventhwalllab/anairyspirit/releases/download';
const TAG = 'anairyspirit (npm)';

/** The release archive for this platform, or null where there is none. */
function archiveFor(platform, arch, version) {
  if (platform === 'darwin') {
    // One universal archive for both Mac arches, flat: `anairyspirit` at its root.
    return { file: `anairyspirit-${version}-macos-universal.tar.gz`, dir: '' };
  }
  if (platform === 'linux') {
    const a = { x64: 'x86_64', arm64: 'arm64' }[arch];
    if (!a) return null;
    return { file: `anairyspirit-${version}-${a}.tar.gz`, dir: `anairyspirit-${version}-${a}` };
  }
  return null;
}

/** The places installs put the program, beside PATH. */
function usualDirs(home) {
  return ['/usr/local/bin', path.join(home, '.local', 'bin'), '/usr/bin',
    '/opt/homebrew/bin', '/home/linuxbrew/.linuxbrew/bin'];
}

/** Where an installed program may be: PATH first, then `extra` (default: usualDirs). */
function candidates(env, home, extra) {
  const dirs = (env.PATH || '').split(path.delimiter).filter(Boolean);
  dirs.push(...(extra || usualDirs(home)));
  const seen = new Set();
  const out = [];
  for (const d of dirs) {
    const f = path.join(d, 'anairyspirit');
    if (!seen.has(f)) { seen.add(f); out.push(f); }
  }
  return out;
}

function realOrNull(f) {
  try { return fs.realpathSync(f); } catch { return null; }
}

/** A Node launcher — this one, or a copy of it in another npm prefix or npx cache. */
function isLauncher(file, selfReal) {
  const real = realOrNull(file);
  if (!real || real === selfReal) return true;
  try {
    const fd = fs.openSync(real, 'r');
    const head = Buffer.alloc(64);
    const n = fs.readSync(fd, head, 0, 64, 0);
    fs.closeSync(fd);
    const s = head.subarray(0, n).toString('latin1');
    return s.startsWith('#!') && s.includes('node');
  } catch {
    return true;
  }
}

/** The installed program, if there is one. */
function findInstalled(env, home, selfFile, extra) {
  const selfReal = realOrNull(selfFile);
  for (const f of candidates(env, home, extra)) {
    try {
      fs.accessSync(f, fs.constants.X_OK);
      if (!fs.statSync(f).isFile()) continue;
    } catch {
      continue;
    }
    if (isLauncher(f, selfReal)) continue;
    return f;
  }
  return null;
}

/** `Anairyspirit v0.1.391` → [0, 1, 391]; null when it says no version. */
function parseVersion(text) {
  const m = /(\d+)\.(\d+)\.(\d+)/.exec(text || '');
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

function compareVersions(a, b) {
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  return 0;
}

/** Download `url` to `dest` (following redirects); resolves to its sha256. */
function download(url, dest, redirects = 5) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('http://') ? http : https;
    const req = mod.get(url, { headers: { 'User-Agent': 'anairyspirit-npm' } }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        res.resume();
        if (redirects <= 0) return reject(new Error(`too many redirects for ${url}`));
        return resolve(download(new URL(res.headers.location, url).toString(), dest, redirects - 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const hash = crypto.createHash('sha256');
      const out = fs.createWriteStream(dest);
      res.on('data', (chunk) => hash.update(chunk));
      res.on('error', reject);
      out.on('error', reject);
      out.on('finish', () => resolve(hash.digest('hex')));
      res.pipe(out);
    });
    req.on('error', reject);
  });
}

/**
 * Download this package's release for this machine into a fresh temporary
 * folder, check it against sums.json and unpack it. Returns the folder, the
 * unpacked directory and the program in it. Nothing is unpacked unless the
 * sha256 matches.
 */
async function fetchRelease(sums, opts) {
  const a = archiveFor(opts.platform, opts.arch, sums.version);
  if (!a) throw new Error(`no release archive for ${opts.platform}/${opts.arch}`);
  const expected = sums.files[a.file];
  if (!expected) throw new Error(`this package lists no checksum for ${a.file}`);
  const base = opts.baseUrl || `${RELEASES}/v${sums.version}`;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'anairyspirit-npm-'));
  const archive = path.join(tmp, a.file);
  opts.log(`Downloading ${a.file} …`);
  let got;
  try {
    got = await download(`${base}/${a.file}`, archive);
  } catch (e) {
    fs.rmSync(tmp, { recursive: true, force: true });
    throw e;
  }
  if (got !== expected) {
    fs.rmSync(tmp, { recursive: true, force: true });
    throw new Error(`${a.file}: sha256 ${got} is not the release's ${expected} — nothing was installed`);
  }
  opts.log('Checksum matches the release.');
  const x = spawnSync('tar', ['-xzf', archive, '-C', tmp], { stdio: 'inherit' });
  if (x.status !== 0) {
    fs.rmSync(tmp, { recursive: true, force: true });
    throw new Error(`could not unpack ${a.file}`);
  }
  const dir = path.join(tmp, a.dir);
  return { tmp, dir, program: path.join(dir, 'anairyspirit') };
}

/** Run a program with this process's terminal; resolves to its exit code. */
function run(program, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(program, args, { stdio: 'inherit', cwd });
    const forward = (sig) => () => { try { child.kill(sig); } catch { /* gone */ } };
    const handlers = { SIGINT: forward('SIGINT'), SIGTERM: forward('SIGTERM'), SIGHUP: forward('SIGHUP') };
    for (const [sig, h] of Object.entries(handlers)) process.on(sig, h);
    const done = () => { for (const [sig, h] of Object.entries(handlers)) process.removeListener(sig, h); };
    child.on('error', (e) => { done(); reject(e); });
    child.on('exit', (code, signal) => {
      done();
      resolve(code !== null ? code : 128 + (os.constants.signals[signal] || 0));
    });
  });
}

async function main(args, opts) {
  const log = opts.log || ((m) => process.stderr.write(`${m}\n`));
  const o = { ...opts, log };
  if (!archiveFor(o.platform, o.arch, o.sums.version)) {
    log(`${TAG}: anairyspirit runs on macOS and on Linux (x86_64, arm64); this is ${o.platform}/${o.arch}.`);
    log('On Windows, run it in Docker: https://github.com/Seventhwalllab/anairyspirit#install');
    return 1;
  }
  const installed = findInstalled(o.env, o.home, o.self, o.extraDirs);

  if (!installed) {
    if (args.length === 0 || args[0] === 'setup') {
      const r = await fetchRelease(o.sums, o);
      try {
        return await run(r.program, ['setup', ...args.slice(1)], r.dir);
      } finally {
        fs.rmSync(r.tmp, { recursive: true, force: true });
      }
    }
    log(`${TAG}: anairyspirit is not installed on this machine yet.`);
    log('Install it first:  npx anairyspirit setup');
    if (args[0] === 'mcp') {
      return notice.serve(o.stdin || process.stdin, o.stdout || process.stdout, o.sums.version);
    }
    return 1;
  }

  if (args[0] === 'update' && !args.includes('--from')) {
    const v = spawnSync(installed, ['--version'], { encoding: 'utf8' });
    const have = parseVersion(v.stdout);
    const want = parseVersion(o.sums.version);
    if (have && compareVersions(have, want) >= 0) {
      log(`${TAG}: the installed anairyspirit is v${have.join('.')}; this package carries v${o.sums.version} — nothing newer here.`);
      log('For the newest release:  npx anairyspirit@latest update');
      return 0;
    }
    const r = await fetchRelease(o.sums, o);
    try {
      return await run(installed, ['update', '--from', r.program, ...args.slice(1)], r.dir);
    } finally {
      fs.rmSync(r.tmp, { recursive: true, force: true });
    }
  }

  return run(installed, args);
}

module.exports = {
  archiveFor, usualDirs, candidates, isLauncher, findInstalled, parseVersion, compareVersions,
  download, fetchRelease, run, main,
};
