/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { join, posix, relative, sep } from 'node:path';
import { storeViteDeps } from '@drizztdourden08/build-cache/vite-deps';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { depsBuildKey, shareDeps } from '../src/shared-deps-cache/share-deps.mjs';
import { configHashOf, lockfileOf, viteHashes } from '../src/shared-deps-cache/vite-hash.mjs';
import { LOCKFILE, storeInstall } from './store-install.mjs';
import { tempTree } from './temp-tree.mjs';

const tree = tempTree('brock-deps-store-');

afterEach(() => {
  tree.cleanup();
  vi.unstubAllEnvs();
});

const PICKER = 'dummy-dep@1.0.0/node_modules/dummy-dep/index.js';
const fsAlias = (file) => posix.join('/@fs/', file.split(sep).join('/'));

const configOf = ({ root, packages }, vite = 'vite@7.3.7') => ({
  command: 'serve',
  mode: 'development',
  root: join(root, 'src'),
  cacheDir: join(root, 'node_modules/.vite'),
  keepProcessEnv: false,
  assetsInclude: () => false,
  plugins: [{ name: 'brock:shared-deps-cache' }],
  resolve: { alias: [{ find: '@app', replacement: join(root, 'src') }, { find: /^\/?@vite\/env/, replacement: fsAlias(join(packages, vite, 'node_modules/vite/dist/client/env.mjs')) }] },
  optimizeDeps: { include: ['dummy-dep'] },
});

const keyOf = (install, vite) => {
  const config = configOf(install, vite);
  return depsBuildKey({ vite: '7.3.7', lockfile: lockfileOf(config.root), configHash: configHashOf(config, { portable: true, installRoot: install.root }) });
};

const withVite = (install) => tree.put(install.root, 'node_modules/vite/package.json', '{"name":"vite","version":"7.3.7"}');

const withPreBundle = (install) => {
  const depsDir = join(install.root, 'node_modules/.vite/deps');
  const src = relative(depsDir, join(install.packages, PICKER)).split(sep).join('/');
  const metadata = { ...viteHashes(configOf(install), { content: LOCKFILE }), browserHash: 'b1', optimized: { 'dummy-dep': { src, file: 'dummy-dep.js', fileHash: 'f1', needsInterop: false } }, chunks: {} };
  tree.put(depsDir, '_metadata.json', JSON.stringify(metadata));
  tree.put(depsDir, 'dummy-dep.js', 'export default 1;');
  tree.put(depsDir, 'package.json', '{"type":"module"}');
};

describe('K1 the pre-bundle key and the package store', { tags: ['critical'] }, () => {
  it('is the same for one lockfile on two package stores, which the store path alone changed', () => {
    const first = storeInstall(tree);
    const second = storeInstall(tree, { depth: 3 });
    const bare = (install) => configHashOf(configOf(install), { portable: true });
    expect(bare(first)).not.toBe(bare(second));
    expect(keyOf(first)).toBe(keyOf(second));
  });

  it('still tells another Vite build in the store apart', () => {
    const install = storeInstall(tree);
    expect(keyOf(install, 'vite@7.3.8')).not.toBe(keyOf(install));
  });

  it('restores a pre-bundle made on one store into an install on another, sources pointing into that one', async () => {
    vi.stubEnv('BROCK_BUILD_CACHE_DIR', tree.tempDir());
    const first = storeInstall(tree);
    withVite(first);
    withPreBundle(first);
    const stored = [];
    expect(shareDeps({ config: configOf(first), rootDir: first.root, store: (input) => stored.push(input) })).toBe('present');
    expect(await storeViteDeps(stored[0])).toBe('stored');

    const second = storeInstall(tree, { depth: 3 });
    withVite(second);
    expect(shareDeps({ config: configOf(second), rootDir: second.root, store: vi.fn() })).toBe('seeded');
    const restored = JSON.parse(readFileSync(join(second.root, 'node_modules/.vite/deps/_metadata.json'), 'utf8'));
    expect(restored.optimized['dummy-dep'].src).toBe(join(second.packages, PICKER));
    expect(restored.hash).toBe(viteHashes(configOf(second), { content: LOCKFILE }).hash);
  });
});
