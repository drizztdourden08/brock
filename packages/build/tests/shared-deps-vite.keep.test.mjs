/* @layer tooling-scripts @kind test */
import { existsSync, readFileSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { storeViteDeps } from '@drizztdourden08/build-cache/vite-deps';
import * as vite from 'vite';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { depsBuildKey, shareDeps } from '../src/shared-deps-cache/share-deps.mjs';
import { configHashOf, lockfileOf, viteHashes } from '../src/shared-deps-cache/vite-hash.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-deps-vite-');

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

const LOCKFILE = 'lockfileVersion: 9\npackages:\n  dummy-dep@1.0.0: {}\n';
const PACKAGE = 'node_modules/.pnpm/dummy-dep@1.0.0/node_modules/dummy-dep';

const worktree = () => {
  const root = tempDir();
  put(root, 'package.json', '{"name":"app"}');
  put(root, 'src/index.html', '');
  put(root, 'node_modules/.pnpm/lock.yaml', LOCKFILE);
  put(root, `${PACKAGE}/package.json`, '{"name":"dummy-dep","version":"1.0.0","type":"module","main":"index.js"}');
  put(root, `${PACKAGE}/index.js`, 'export const answer = 42;\n');
  symlinkSync(join(root, PACKAGE), join(root, 'node_modules/dummy-dep'), 'junction');
  return root;
};

const resolved = (root) => vite.resolveConfig({
  root: join(root, 'src'),
  configFile: false,
  logLevel: 'silent',
  cacheDir: join(root, 'node_modules/.vite'),
  resolve: { alias: { '@app': join(root, 'src') } },
  optimizeDeps: { include: ['dummy-dep'] },
  plugins: [{ name: 'fixture' }],
}, 'serve', 'development');

const metadataOf = (root) => JSON.parse(readFileSync(join(root, 'node_modules/.vite/deps/_metadata.json'), 'utf8'));

describe('the cache against Vite itself', () => {
  it('rebuilds the three hashes Vite writes, and Vite accepts a pre-bundle taken from another worktree', { timeout: 120_000 }, async () => {
    vi.stubEnv('BROCK_BUILD_CACHE_DIR', tempDir());
    const first = worktree();
    const config = await resolved(first);
    await vite.optimizeDeps(config, true);
    const written = metadataOf(first);
    expect({ hash: written.hash, configHash: written.configHash, lockfileHash: written.lockfileHash }).toEqual(viteHashes(config, lockfileOf(config.root)));

    const stored = [];
    shareDeps({ config, rootDir: first, store: (input) => stored.push(input) });
    expect(await storeViteDeps(stored[0])).toBe('stored');

    const second = worktree();
    const otherConfig = await resolved(second);
    expect(shareDeps({ config: otherConfig, rootDir: second, store: () => 'started' })).toBe('seeded');
    expect(metadataOf(second).configHash).not.toBe(written.configHash);

    const metadata = await vite.optimizeDeps(otherConfig, false);
    expect(metadata.browserHash).toBe(written.browserHash);
    expect(existsSync(join(second, 'node_modules/.vite/deps/dummy-dep.js'))).toBe(true);

    const built = await vite.optimizeDeps(await resolved(worktree()), false);
    expect(built.browserHash).not.toBe(written.browserHash);
  });

  it('keys two roots the same and another lockfile apart', async () => {
    const keyOf = async (root, content) => depsBuildKey({ vite: vite.version, lockfile: { content }, configHash: configHashOf(await resolved(root), { portable: true }) });
    const same = await keyOf(worktree(), LOCKFILE);
    expect(await keyOf(worktree(), LOCKFILE)).toBe(same);
    expect(await keyOf(worktree(), `${LOCKFILE}x`)).not.toBe(same);
  });
});
