/* @layer tooling-scripts @kind test */
import { utimesSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contentStampOf } from '../src/build-reuse/file-stamp.mjs';
import { moduleKeys } from '../src/build-reuse/module-keys.mjs';
import { identityOf, sharedEnvKey } from '../src/build-reuse/shared-build/env-key.mjs';
import { publishBuild } from '../src/build-reuse/shared-build/store-shared-build.mjs';
import { restoreSharedBuild } from '../src/build-reuse/shared-build/restore-shared-build.mjs';
import { repoSnapshot } from '../src/build-reuse/repo-snapshot.mjs';
import { cloneOf, lines, put, repo, tempDir, useSharedCache } from './shared-build-fixture.mjs';

const freshCache = useSharedCache();

const PLACED = 'node_modules/.build-cache/node_modules/@scope/pkg';

const writeEntry = (cache, hash) => {
  const entry = join(cache, 'package/@scope+pkg/1.0.0/node-abc');
  put(entry, 'manifest.json', JSON.stringify({ contentHash: hash }));
  return entry;
};

const place = (root, { entry, hash, code, when }) => {
  put(root, `${PLACED}/.build-cache.json`, JSON.stringify({ contentHash: hash, from: entry }));
  put(root, `${PLACED}/main.js`, code);
  utimesSync(join(root, PLACED, 'main.js'), when, when);
};

const record = (root) => {
  const snapshot = repoSnapshot(root);
  const ids = [join(root, 'electron/main.js'), join(root, 'electron/greet.js'), join(root, PLACED, 'main.js')];
  const keys = moduleKeys(ids, Date.now(), { snapshot });
  const preflight = sharedEnvKey(root, 'main', identityOf(root, snapshot));
  return { key: 'k', ...keys, outputs: [{ fileName: 'main.js', base64: Buffer.from('x').toString('base64') }], preflight };
};

const store = async (root) => publishBuild({ rootDir: root, target: 'main', record: record(root), outDir: join(root, 'dist/electron'), snapshot: repoSnapshot(root) });

const restore = (root) => {
  const { found, log } = lines();
  return { ...restoreSharedBuild(root, { log, targets: ['main'] }), found };
};

const HOUR = 3_600_000;

const oldBuild = async (cache) => {
  const entry = writeEntry(cache, 'H1');
  const root = repo();
  place(root, { entry, hash: 'H1', code: 'export {};', when: new Date(Date.now() - 5 * HOUR) });
  return { entry, root, stored: await store(root) };
};

describe('compiled packages copied from the build cache', () => {
  it('hits in a worktree that has the same copy with other file times, or none yet', async () => {
    const { entry, root, stored } = await oldBuild(freshCache());
    expect(Object.keys(record(root).placed)).toEqual(['@scope/pkg']);
    expect(Object.keys(record(root).repo).some((rel) => rel.includes('.build-cache'))).toBe(false);
    expect(stored).toBe('stored');
    const none = cloneOf(root);
    expect(restore(none).hit).toBe(true);
    const other = cloneOf(root);
    place(other, { entry, hash: 'H1', code: 'export {};', when: new Date() });
    expect(restore(other).hit).toBe(true);
  });

  it('misses when the placed copy differs or the cache entry changed', async () => {
    const cache = freshCache();
    const { entry, root } = await oldBuild(cache);
    const changed = cloneOf(root);
    place(changed, { entry, hash: 'H2', code: 'export const a = 1;', when: new Date() });
    const result = restore(changed);
    expect(result.hit).toBe(false);
    expect(result.found[0]).toContain('@scope/pkg (compiled package)');
    writeEntry(cache, 'H3');
    expect(restore(cloneOf(root)).hit).toBe(false);
  });
});

describe('files outside the repository', () => {
  it('are keyed by content, so other file times give the same key, and other content another', () => {
    freshCache();
    const outside = tempDir();
    put(outside, 'a.js', 'export const a = 1;\n');
    put(outside, 'b.js', 'export const a = 1;\n');
    put(outside, 'c.js', 'export const a = 2;\n');
    utimesSync(join(outside, 'a.js'), new Date(Date.now() - 9 * HOUR), new Date(Date.now() - 9 * HOUR));
    expect(contentStampOf(join(outside, 'a.js'))).toBe(contentStampOf(join(outside, 'b.js')));
    expect(contentStampOf(join(outside, 'a.js'))).not.toBe(contentStampOf(join(outside, 'c.js')));
    const keys = moduleKeys([join(outside, 'a.js')], Date.now(), { snapshot: null });
    expect(keys.files[join(outside, 'a.js')]).toBe(contentStampOf(join(outside, 'b.js')));
  });
});
