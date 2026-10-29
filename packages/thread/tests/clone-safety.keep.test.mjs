/* @layer tooling-scripts @kind test */
import { existsSync, mkdirSync, readdirSync, readFileSync, realpathSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cloneStoreProblem } from '../src/worktree/clone/check-clone-store.mjs';
import { cloneInstall } from '../src/worktree/clone/clone-install.mjs';
import { storeDamage } from '../src/worktree/clone/store-entry.mjs';
import { strayLinks } from '../src/worktree/clone/verify-links.mjs';
import { freshCheckout, installedCheckout, link, LOCKFILE, put, tempFolder, useCloneFixture } from './clone-fixture.mjs';

const storeRootOf = useCloneFixture();

const logs = [];
const clone = (target, source) => cloneInstall({ target, main: source, log: (line) => logs.push(line), worktrees: [] });
const DEP = 'node_modules/.pnpm/dep@1.0.0/node_modules/dep';

describe('the shared store survives damage', () => {
  it('reads an emptied package folder as damage, tells a cloned worktree so, leaves the entry where it is and links the next clone to a fresh one', async () => {
    const source = installedCheckout();
    const first = freshCheckout();
    const { store } = await clone(first, source);
    const entry = join(store, '..', '..');
    expect(storeDamage(entry)).toEqual([]);
    expect(cloneStoreProblem(first)).toBeNull();
    rmSync(join(entry, DEP, 'package.json'));
    expect(storeDamage(entry)).toContain('dep@1.0.0');
    expect(cloneStoreProblem(first)).toContain('shared store damaged, rebuild it');
    const second = freshCheckout();
    const next = await clone(second, source);
    expect(next.store).not.toBe(store);
    expect(logs.some((line) => line.includes('stays where it is'))).toBe(true);
    expect(existsSync(entry)).toBe(true);
    expect(storeDamage(entry)).toContain('dep@1.0.0');
    expect(readFileSync(join(next.store, '..', '..', DEP, 'package.json'), 'utf8')).toContain('"dep"');
    expect(storeDamage(join(next.store, '..', '..'))).toEqual([]);
    const third = await clone(freshCheckout(), source);
    expect(third.store).toBe(next.store);
  });

  it('records each clone as a user of its store entry, once per worktree', async () => {
    const source = installedCheckout();
    const target = freshCheckout();
    const { store } = await clone(target, source);
    const users = join(store, '..', '..', 'users');
    const [name] = readdirSync(users);
    expect(readdirSync(users)).toHaveLength(1);
    expect(name).toMatch(/^[0-9a-f]{40}\.json$/);
    const record = JSON.parse(readFileSync(join(users, name), 'utf8'));
    expect(record).toMatchObject({ worktree: realpathSync(target), repo: source });
    expect(typeof record.createdAt).toBe('string');
    await clone(freshCheckout(), source);
    expect(readdirSync(users)).toHaveLength(2);
  });

  it('falls back to a real install when a project node_modules of the source is empty', async () => {
    const source = installedCheckout();
    const lockfile = `${LOCKFILE}  packages/pkg:
    dependencies: {}
`;
    put(source, 'pnpm-lock.yaml', lockfile);
    put(source, 'node_modules/.pnpm/lock.yaml', lockfile);
    mkdirSync(join(source, 'packages/pkg/node_modules'), { recursive: true });
    const target = freshCheckout(lockfile);
    expect(await clone(target, source)).toBeNull();
    expect(logs.some((line) => line.includes('is empty'))).toBe(true);
    expect(existsSync(join(target, 'node_modules'))).toBe(false);
  });
});

describe('what a clone may take links from', () => {
  it('refuses a checkout whose node_modules is a link', async () => {
    const real = installedCheckout();
    const linked = tempFolder('brock-linked-');
    put(linked, 'pnpm-lock.yaml', readFileSync(join(real, 'pnpm-lock.yaml'), 'utf8'));
    link(linked, 'node_modules', join(real, 'node_modules'));
    const target = freshCheckout();
    expect(await clone(target, linked)).toBeNull();
    expect(existsSync(join(target, 'node_modules'))).toBe(false);
    expect(existsSync(join(real, 'node_modules/dep/package.json'))).toBe(true);
  });

  it('builds no store from links that leave the install, and falls back to a real install', async () => {
    const source = installedCheckout();
    const other = tempFolder('brock-other-');
    put(other, '.git/HEAD', 'ref: refs/heads/main\n');
    link(source, 'node_modules/.pnpm/dep@1.0.0/node_modules/elsewhere', other);
    const target = freshCheckout();
    expect(await clone(target, source)).toBeNull();
    expect(existsSync(join(target, 'node_modules'))).toBe(false);
    expect(readdirSync(storeRootOf()).filter((name) => name !== '.tmp')).toHaveLength(0);
    expect(existsSync(join(other, '.git/HEAD'))).toBe(true);
  });

  it('flags a link into another checkout, and accepts one into the worktree', () => {
    const home = tempFolder('brock-home-');
    const checkout = tempFolder('brock-checkout-');
    put(checkout, '.git/HEAD', 'ref\n');
    put(checkout, 'src/a.js', '');
    put(home, 'packages/own/a.js', '');
    link(home, 'node_modules/own', join(home, 'packages/own'));
    link(home, 'node_modules/bad', join(checkout, 'src'));
    const found = strayLinks({ roots: [join(home, 'node_modules')], homes: [home] });
    expect(found.map((item) => item.path)).toEqual([join(home, 'node_modules', 'bad')]);
  });
});
