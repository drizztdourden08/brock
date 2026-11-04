/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, readlinkSync, realpathSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cloneInstall } from '../src/worktree/clone/clone-install.mjs';
import { isInside } from '../src/worktree/clone/path-map.mjs';
import { deleteTree } from '../src/worktree/delete-tree.mjs';
import { freshCheckout, installedCheckout, link, LOCKFILE, put, useCloneFixture } from './clone-fixture.mjs';

const storeRootOf = useCloneFixture();

const linksUnder = (dir, found = []) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isSymbolicLink()) found.push({ path: full, target: resolve(dirname(full), readlinkSync(full)) });
    else if (entry.isDirectory()) linksUnder(full, found);
  }
  return found;
};

const clone = (target, source) => cloneInstall({ target, main: source, log: () => undefined, worktrees: [] });

describe('K3 cloneInstall', { tags: ['standard'] }, () => {
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

  it('undoes a copy with a dangling link by removing links as links, leaving the source, the store and the tracked files whole', async () => {
    const source = installedCheckout();
    link(source, 'node_modules/ghost', join(source, 'node_modules/.pnpm/ghost@1.0.0/node_modules/ghost'));
    const target = freshCheckout();
    expect(await clone(target, source)).toBeNull();
    expect(existsSync(join(target, 'node_modules'))).toBe(false);
    expect(existsSync(join(target, 'packages/pkg/package.json'))).toBe(true);
    expect(existsSync(join(source, 'packages/pkg/package.json'))).toBe(true);
    expect(existsSync(join(source, 'node_modules/.pnpm/dep@1.0.0/node_modules/dep/package.json'))).toBe(true);
    expect(existsSync(join(storeRootOf(), readdirSync(storeRootOf()).find((name) => name !== '.tmp'), 'node_modules/.pnpm/dep@1.0.0/node_modules/dep/package.json'))).toBe(true);
  });

  it('runs no copy when the new lockfile differs by one byte', async () => {
    const source = installedCheckout();
    const target = freshCheckout(`${LOCKFILE} `);
    expect(await clone(target, source)).toBeNull();
    expect(existsSync(join(target, 'node_modules'))).toBe(false);
  });

});

describe('S2 cloneInstall source pick', () => {
  it('clones from a checkout whose own install rewrote its committed lockfile, and only when the install inputs match', { tags: ['e2e'] }, async () => {
    const source = installedCheckout();
    put(source, '.npmrc', 'auto-install-peers=true\n');
    const git = (...args) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.com', '-c', 'core.autocrlf=false', ...args], { windowsHide: true, cwd: source, stdio: 'pipe' });
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
    put(source, 'pnpm-lock.yaml', LOCKFILE);
    const restored = freshCheckout();
    put(restored, '.npmrc', 'auto-install-peers=true\n');
    expect(await clone(restored, source)).not.toBeNull();
  });

  it('copies a git-ignored local pnpmfile of the source along, so a later install resolves the same way', { tags: ['e2e'] }, async () => {
    const source = installedCheckout();
    const git = (...args) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.com', '-c', 'core.autocrlf=false', ...args], { windowsHide: true, cwd: source, stdio: 'pipe' });
    git('init', '-q');
    put(source, '.gitignore', '/.pnpmfile.cjs\nnode_modules/\n');
    git('add', 'pnpm-lock.yaml', '.gitignore');
    git('commit', '-q', '-m', 'lockfile');
    put(source, '.pnpmfile.cjs', 'module.exports = {};\n');
    put(source, 'pnpm-lock.yaml', `${LOCKFILE}pnpmfileChecksum: sha256-x\n`);
    put(source, 'node_modules/.pnpm/lock.yaml', `${LOCKFILE}pnpmfileChecksum: sha256-x\n`);
    const target = freshCheckout();
    put(target, '.gitignore', '/.pnpmfile.cjs\nnode_modules/\n');
    expect(await clone(target, source)).not.toBeNull();
    expect(readFileSync(join(target, '.pnpmfile.cjs'), 'utf8')).toBe('module.exports = {};\n');
  });

  it('treats a lockfile git checked out with CRLF line ends as the same lockfile', { tags: ['standard'] }, async () => {
    const source = installedCheckout();
    expect(await clone(freshCheckout(LOCKFILE.replace(/\n/g, '\r\n')), source)).not.toBeNull();
  });

  it('builds the shared store once and reuses it for the next checkout', { tags: ['standard'] }, async () => {
    const source = installedCheckout();
    const first = await clone(freshCheckout(), source);
    const second = await clone(freshCheckout(), source);
    expect(second.store).toBe(first.store);
    expect(readdirSync(storeRootOf()).filter((name) => name !== '.tmp')).toHaveLength(1);
  });

  it('removing a cloned worktree leaves the shared store whole', { tags: ['standard'] }, async () => {
    const source = installedCheckout();
    const target = freshCheckout();
    const { store } = await clone(target, source);
    expect(await deleteTree({ owner: target, target: join(target, 'node_modules'), mains: [source] })).toBeNull();
    expect(existsSync(join(target, 'node_modules'))).toBe(false);
    expect(readFileSync(join(store, 'dep@1.0.0/node_modules/dep/package.json'), 'utf8')).toContain('"dep"');
    expect(existsSync(join(source, 'packages/pkg/package.json'))).toBe(true);
  });
});
