/* @layer tooling-scripts @kind test */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { identityOf, sharedEnvKey } from '../src/build-reuse/shared-build/env-key.mjs';
import { restoreSharedBuild } from '../src/build-reuse/shared-build/restore-shared-build.mjs';
import { repoSnapshot } from '../src/build-reuse/repo-snapshot.mjs';
import { buildMain } from './main-bundle-build.mjs';
import { cloneOf, git, lines, outFile, put, repo, reuseLogger, useSharedCache } from './shared-build-fixture.mjs';

const freshCache = useSharedCache();
const { messages, customLogger } = reuseLogger();

const run = (root) => buildMain(root, customLogger);

const keyOf = (root) => sharedEnvKey(root, 'main', identityOf(root, repoSnapshot(root)));

const restore = (root) => {
  const { found, log } = lines();
  return { ...restoreSharedBuild(root, { log, targets: ['main'] }), found };
};

describe('the shared key', () => {
  it('is stable for one checkout and for another checkout of the same commit', () => {
    freshCache();
    const root = repo();
    expect(keyOf(root)).toBe(keyOf(root));
    expect(keyOf(cloneOf(root))).toBe(keyOf(root));
  });

  it('changes with the lockfile, a config file and a Vite env value', () => {
    freshCache();
    const root = repo();
    const before = keyOf(root);
    put(root, 'node_modules/.pnpm/lock.yaml', 'lockfileVersion: 9\n');
    const locked = keyOf(root);
    expect(locked).not.toBe(before);
    put(root, 'brock.config.ts', 'export default {};\n');
    expect(keyOf(root)).not.toBe(locked);
    const withConfig = keyOf(root);
    process.env.MAIN_VITE_SHARED_TEST = 'one';
    const withEnv = keyOf(root);
    delete process.env.MAIN_VITE_SHARED_TEST;
    expect(withEnv).not.toBe(withConfig);
  });
});

describe('reusing a build in another worktree', () => {
  it('restores the output and the reuse record, and the in-worktree reuse then accepts them', async () => {
    freshCache();
    const root = repo();
    await run(root);
    const copy = cloneOf(root);
    const result = restore(copy);
    expect(result.hit).toBe(true);
    expect(result.found).toHaveLength(1);
    expect(result.found[0]).toMatch(/reused the main build from the build cache in \d+ ms/);
    expect(readFileSync(outFile(copy), 'utf8')).toContain('hello one');
    expect(existsSync(join(copy, 'node_modules/.vite/brock-build-reuse/main.json'))).toBe(true);
    messages.length = 0;
    await run(copy);
    expect(messages.some((message) => message.includes('reused the main bundle'))).toBe(true);
    expect(restore(copy).found[0]).toContain('from this worktree');
  });

  it('misses with the first changed file when a committed source differs', async () => {
    freshCache();
    const root = repo();
    await run(root);
    const copy = cloneOf(root);
    put(copy, 'electron/greet.js', "export const greet = () => 'hello two';\n");
    git(copy, 'commit', '-q', '-am', 'change');
    const result = restore(copy);
    expect(result.hit).toBe(false);
    expect(result.found[0]).toContain('changed file electron/greet.js');
    expect(existsSync(outFile(copy))).toBe(false);
  });

  it('misses when a tracked file has an uncommitted edit', async () => {
    freshCache();
    const root = repo();
    await run(root);
    const copy = cloneOf(root);
    put(copy, 'electron/main.js', 'console.log("dirty");\n');
    const result = restore(copy);
    expect(result.hit).toBe(false);
    expect(result.found[0]).toContain('changed file electron/main.js');
  });

  it('says there is no entry when the cache is empty', () => {
    freshCache();
    expect(restore(repo()).found[0]).toContain('no entry in the build cache');
  });

  it('keeps an older variant beside a newer one, so each checkout finds its own', async () => {
    freshCache();
    const root = repo();
    await run(root);
    put(root, 'electron/greet.js', "export const greet = () => 'hello three';\n");
    await run(root);
    const copy = cloneOf(root);
    expect(restore(copy).hit).toBe(true);
    expect(readFileSync(outFile(copy), 'utf8')).toContain('hello one');
    git(root, 'commit', '-q', '-am', 'three');
    await run(root);
    const later = cloneOf(root);
    expect(restore(later).hit).toBe(true);
    expect(readFileSync(outFile(later), 'utf8')).toContain('hello three');
  });

  it('ignores the files the launch generates in .brock but not other new files there', () => {
    const root = repo();
    put(root, '.brock/tessera.ts', 'export {};\n');
    git(root, 'add', '-A');
    git(root, 'commit', '-q', '-m', 'brock dir');
    const before = repoSnapshot(root).dirKeyOf('.brock');
    put(root, '.brock/tessera-parts.ts', 'export {};\n');
    expect(repoSnapshot(root).dirKeyOf('.brock')).toBe(before);
    put(root, '.brock/other.ts', 'export {};\n');
    expect(repoSnapshot(root).dirKeyOf('.brock')).not.toBe(before);
  });
});
