/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, readlinkSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cloneInstall } from '../src/worktree/clone/clone-install.mjs';
import { isInside } from '../src/worktree/clone/path-map.mjs';
import { deleteTree } from '../src/worktree/delete-tree.mjs';

const LINK = process.platform === 'win32' ? 'junction' : 'dir';
const LOCKFILE = "lockfileVersion: '9.0'\n\nimporters:\n\n  .:\n    dependencies:\n      dep:\n        specifier: ^1.0.0\n        version: 1.0.0\n";

const made = [];
let storeRoot = '';

const tempFolder = (prefix) => {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), prefix)));
  made.push(dir);
  return dir;
};

beforeEach(() => {
  storeRoot = tempFolder('brock-store-');
  process.env.BROCK_MODULES_STORE_DIR = storeRoot;
});

afterEach(() => {
  delete process.env.BROCK_MODULES_STORE_DIR;
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const put = (root, path, content = '') => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content);
};

const link = (root, path, target) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  symlinkSync(target, join(root, path), LINK);
};


const installedCheckout = () => {
  const source = tempFolder('brock-source-');
  const store = join(source, 'node_modules', '.pnpm');
  put(source, 'pnpm-lock.yaml', LOCKFILE);
  put(source, 'packages/pkg/package.json', '{"name":"@ws/pkg"}');
  put(source, 'node_modules/.modules.yaml', `layoutVersion: 5\nnodeLinker: isolated\nvirtualStoreDir: ${store}\n`);
  put(source, 'node_modules/.pnpm/lock.yaml', LOCKFILE);
  put(source, 'node_modules/.pnpm/dep@1.0.0/node_modules/dep/package.json', '{"name":"dep","version":"1.0.0"}');
  put(source, 'node_modules/.pnpm/sub@1.0.0/node_modules/sub/index.js', 'module.exports = 1;');
  link(source, 'node_modules/.pnpm/dep@1.0.0/node_modules/sub', join(store, 'sub@1.0.0/node_modules/sub'));
  link(source, 'node_modules/.pnpm/node_modules/sub', join(store, 'sub@1.0.0/node_modules/sub'));
  link(source, 'node_modules/.pnpm/node_modules/@ws/pkg', join(source, 'packages/pkg'));
  link(source, 'node_modules/dep', join(store, 'dep@1.0.0/node_modules/dep'));
  link(source, 'node_modules/@ws/pkg', join(source, 'packages/pkg'));
  put(source, 'node_modules/.bin/dep.CMD', `@SET "NODE_PATH=${join(store, 'dep@1.0.0', 'node_modules')}"\n`);
  return source;
};

const freshCheckout = (lockfile = LOCKFILE) => {
  const target = tempFolder('brock-target-');
  put(target, 'pnpm-lock.yaml', lockfile);
  put(target, 'packages/pkg/package.json', '{"name":"@ws/pkg"}');
  return target;
};

const linksUnder = (dir, found = []) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isSymbolicLink()) found.push({ path: full, target: resolve(dirname(full), readlinkSync(full)) });
    else if (entry.isDirectory()) linksUnder(full, found);
  }
  return found;
};

const clone = (target, source) => cloneInstall({ target, main: source, log: () => undefined, worktrees: [] });

describe('cloneInstall', () => {
  it('links node_modules from a checkout of the same lockfile, every link outside the source checkout, root packages above the store', async () => {
    const source = installedCheckout();
    const target = freshCheckout();
    const result = await clone(target, source);
    expect(result?.source).toBe(source);
    expect(readFileSync(join(target, 'node_modules/dep/package.json'), 'utf8')).toContain('"dep"');
    expect(realpathSync(join(target, 'node_modules/@ws/pkg'))).toBe(join(target, 'packages', 'pkg'));
    const entry = dirname(dirname(result.store));
    expect(existsSync(join(entry, 'node_modules/dep/package.json'))).toBe(true);
    expect(existsSync(join(entry, 'node_modules/@ws/pkg'))).toBe(false);
    for (const { path, target: to } of [...linksUnder(join(target, 'node_modules')), ...linksUnder(entry)]) {
      expect(isInside(source, to) && !isInside(target, to), `${path} -> ${to}`).toBe(false);
    }
    expect(readFileSync(join(target, 'node_modules/.bin/dep.CMD'), 'utf8')).not.toContain(source);
    expect(readFileSync(join(target, 'node_modules/.modules.yaml'), 'utf8')).toContain(`virtualStoreDir: ${result.store}`);
    expect(readFileSync(join(target, 'node_modules/.pnpm/lock.yaml'), 'utf8')).toBe(LOCKFILE);
  });

  it('runs no copy when the new lockfile differs by one byte', async () => {
    const source = installedCheckout();
    const target = freshCheckout(`${LOCKFILE} `);
    expect(await clone(target, source)).toBeNull();
    expect(existsSync(join(target, 'node_modules'))).toBe(false);
  });

});

describe('cloneInstall source pick', () => {
  it('clones from a checkout whose own install rewrote its committed lockfile, and only when the install inputs match', async () => {
    const source = installedCheckout();
    put(source, '.npmrc', 'auto-install-peers=true\n');
    const git = (...args) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.com', '-c', 'core.autocrlf=false', ...args], { cwd: source, stdio: 'pipe' });
    git('init', '-q');
    git('add', 'pnpm-lock.yaml', '.npmrc');
    git('commit', '-q', '-m', 'lockfile');
    const rewritten = `${LOCKFILE}pnpmfileChecksum: sha256-x\n`;
    put(source, 'pnpm-lock.yaml', rewritten);
    put(source, 'node_modules/.pnpm/lock.yaml', rewritten);
    const same = freshCheckout();
    put(same, '.npmrc', 'auto-install-peers=true\n');
    expect(await clone(same, source)).not.toBeNull();
    const other = freshCheckout();
    put(other, '.npmrc', 'auto-install-peers=false\n');
    expect(await clone(other, source)).toBeNull();
  });

  it('treats a lockfile git checked out with CRLF line ends as the same lockfile', async () => {
    const source = installedCheckout();
    expect(await clone(freshCheckout(LOCKFILE.replace(/\n/g, '\r\n')), source)).not.toBeNull();
  });

  it('builds the shared store once and reuses it for the next checkout', async () => {
    const source = installedCheckout();
    const first = await clone(freshCheckout(), source);
    const second = await clone(freshCheckout(), source);
    expect(second.store).toBe(first.store);
    expect(readdirSync(storeRoot).filter((name) => name !== '.tmp')).toHaveLength(1);
  });

  it('removing a cloned worktree leaves the shared store whole', async () => {
    const source = installedCheckout();
    const target = freshCheckout();
    const { store } = await clone(target, source);
    expect(await deleteTree(target, join(target, 'node_modules'))).toBeNull();
    expect(existsSync(join(target, 'node_modules'))).toBe(false);
    expect(readFileSync(join(store, 'dep@1.0.0/node_modules/dep/package.json'), 'utf8')).toContain('"dep"');
    expect(existsSync(join(source, 'packages/pkg/package.json'))).toBe(true);
  });
});
