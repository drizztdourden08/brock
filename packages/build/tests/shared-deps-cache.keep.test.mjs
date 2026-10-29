/* @layer tooling-scripts @kind test */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { listEntries } from '@drizztdourden08/build-cache';
import { storeViteDeps } from '@drizztdourden08/build-cache/vite-deps';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { depsBuildKey, shareDeps } from '../src/shared-deps-cache/share-deps.mjs';
import { configHashOf, viteHashes } from '../src/shared-deps-cache/vite-hash.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-shared-deps-');

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

const LOCKFILE = 'lockfileVersion: 9\npackages:\n  picker@1.0.0: {}\n';
const SRC = '../../.pnpm/picker@1.0.0/node_modules/picker/index.js';

const makeConfig = (root, overrides = {}) => ({
  command: 'serve',
  mode: 'development',
  root: join(root, 'src'),
  cacheDir: join(root, 'node_modules/.vite'),
  keepProcessEnv: false,
  assetsInclude: () => false,
  plugins: [{ name: 'vite:react' }, { name: 'brock:optimize-deps' }],
  resolve: { alias: [{ find: '@app', replacement: join(root, 'src') }], dedupe: ['react'] },
  optimizeDeps: { include: ['react', 'picker'] },
  ...overrides,
});

const app = ({ lockfile = LOCKFILE, withCache = true, installed = true } = {}) => {
  const root = tempDir();
  put(root, 'package.json', '{"name":"app"}');
  put(root, 'node_modules/vite/package.json', '{"name":"vite","version":"7.3.7"}');
  put(root, 'node_modules/.pnpm/lock.yaml', lockfile);
  if (installed) put(root, 'node_modules/.pnpm/picker@1.0.0/node_modules/picker/index.js', 'export default 1;');
  const config = makeConfig(root);
  if (withCache) {
    const metadata = { ...viteHashes(config, { content: lockfile }), browserHash: 'b1', optimized: { picker: { src: SRC, file: 'picker.js', fileHash: 'f1', needsInterop: false } }, chunks: {} };
    put(root, 'node_modules/.vite/deps/_metadata.json', JSON.stringify(metadata));
    put(root, 'node_modules/.vite/deps/picker.js', 'export default 1;');
    put(root, 'node_modules/.vite/deps/package.json', '{"type":"module"}');
  }
  return { root, config };
};

const depsOf = (root) => join(root, 'node_modules/.vite/deps');
const metadataOf = (root) => JSON.parse(readFileSync(join(depsOf(root), '_metadata.json'), 'utf8'));
const entriesOf = (cache) => listEntries(cache).filter(({ manifest }) => manifest?.kind === 'vite-deps');

const publish = async (first) => {
  const stored = [];
  shareDeps({ config: first.config, rootDir: first.root, store: (input) => stored.push(input) });
  return storeViteDeps(stored[0]);
};

describe('configHashOf', () => {
  it('names the worktree unless portable, and always names the optimizer inputs', () => {
    const one = makeConfig(tempDir());
    const two = makeConfig(tempDir());
    expect(configHashOf(one)).not.toBe(configHashOf(two));
    expect(configHashOf(one, { portable: true })).toBe(configHashOf(two, { portable: true }));
    expect(configHashOf({ ...one, optimizeDeps: { include: ['react', 'bar'] } }, { portable: true })).not.toBe(configHashOf(one, { portable: true }));
    expect(configHashOf({ ...one, plugins: [{ name: 'other' }] }, { portable: true })).not.toBe(configHashOf(one, { portable: true }));
    vi.stubEnv('NODE_ENV', '');
    expect(configHashOf({ ...one, mode: 'production' }, { portable: true })).not.toBe(configHashOf(one, { portable: true }));
  });

  it('does not depend on the order or the repeats of the include list', () => {
    const base = makeConfig(tempDir());
    expect(configHashOf({ ...base, optimizeDeps: { include: ['picker', 'react', 'picker'] } })).toBe(configHashOf(base));
  });

  it('keeps the alias targets in the portable hash, relative to the root', () => {
    const base = makeConfig(tempDir());
    const aliased = (replacement) => ({ ...base, resolve: { ...base.resolve, alias: [{ find: '@app', replacement }] } });
    const same = configHashOf(aliased(join(base.root, 'ui')), { portable: true });
    expect(configHashOf(aliased(join(base.root, 'other')), { portable: true })).not.toBe(same);
    const moved = makeConfig(tempDir());
    expect(configHashOf({ ...moved, resolve: { ...moved.resolve, alias: [{ find: '@app', replacement: join(moved.root, 'ui') }] } }, { portable: true })).toBe(same);
  });
});

describe('depsBuildKey', () => {
  const parts = { vite: '7.3.7', lockfile: { content: LOCKFILE }, configHash: 'abc' };

  it('gives the same key for the same inputs and starts with the platform', () => {
    expect(depsBuildKey({ ...parts, lockfile: { content: LOCKFILE } })).toBe(depsBuildKey(parts));
    expect(depsBuildKey(parts)).toMatch(new RegExp(`^${process.platform}-${process.arch}-[0-9a-f]{16}$`));
  });

  it('moves with the lockfile content, the Vite version and the optimizer config', () => {
    expect(depsBuildKey({ ...parts, lockfile: { content: `${LOCKFILE}  bar@2.0.0: {}\n` } })).not.toBe(depsBuildKey(parts));
    expect(depsBuildKey({ ...parts, vite: '7.3.8' })).not.toBe(depsBuildKey(parts));
    expect(depsBuildKey({ ...parts, configHash: 'abd' })).not.toBe(depsBuildKey(parts));
  });
});

describe('shareDeps', () => {
  it('stores a current pre-bundle, then restores it in a second worktree with that worktree hashes', async () => {
    const cache = tempDir();
    vi.stubEnv('BROCK_BUILD_CACHE_DIR', cache);
    const first = app();
    expect(await publish(first)).toBe('stored');
    expect(entriesOf(cache)).toHaveLength(1);

    const second = app({ withCache: false });
    const store = vi.fn();
    expect(shareDeps({ config: second.config, rootDir: second.root, store })).toBe('seeded');
    expect(store).not.toHaveBeenCalled();
    const restored = metadataOf(second.root);
    const hashes = viteHashes(second.config, { content: LOCKFILE });
    expect([restored.hash, restored.configHash, restored.lockfileHash]).toEqual([hashes.hash, hashes.configHash, hashes.lockfileHash]);
    expect(restored.browserHash).toBe('b1');
    expect(restored.optimized.picker.src).toBe(join(second.root, 'node_modules/.pnpm/picker@1.0.0/node_modules/picker/index.js'));
    expect(readFileSync(join(depsOf(second.root), 'picker.js'), 'utf8')).toBe('export default 1;');
    expect(readdirSync(join(second.root, 'node_modules/.vite')).filter((name) => name.includes('restore'))).toEqual([]);
    expect(shareDeps({ config: second.config, rootDir: second.root, store })).toBe('present');
  });

  it('asks for a store when it restored nothing, and replaces a stale pre-bundle only from a hit', async () => {
    const cache = tempDir();
    vi.stubEnv('BROCK_BUILD_CACHE_DIR', cache);
    const stale = app();
    writeFileSync(join(depsOf(stale.root), '_metadata.json'), JSON.stringify({ hash: 'old', configHash: 'old', lockfileHash: 'old', optimized: {}, chunks: {} }));
    const store = vi.fn();
    expect(shareDeps({ config: stale.config, rootDir: stale.root, store })).toBe('missing');
    expect(store).toHaveBeenCalledTimes(1);
    expect(metadataOf(stale.root).hash).toBe('old');

    const fresh = app();
    expect(await publish(fresh)).toBe('stored');
    expect(shareDeps({ config: stale.config, rootDir: stale.root, store })).toBe('seeded');
    expect(metadataOf(stale.root).hash).toBe(viteHashes(stale.config, { content: LOCKFILE }).hash);
  });

});

describe('shareDeps misses', () => {
  it('reads another lockfile, another optimizer include or an uninstalled dependency as a miss', async () => {
    const cache = tempDir();
    vi.stubEnv('BROCK_BUILD_CACHE_DIR', cache);
    await publish(app());
    const miss = (worktree) => shareDeps({ config: worktree.config, rootDir: worktree.root, store: () => 'started' });
    expect(miss(app({ lockfile: `${LOCKFILE}  bar@2.0.0: {}\n`, withCache: false }))).toBe('missing');
    const wider = app({ withCache: false });
    wider.config.optimizeDeps = { include: ['react', 'picker', 'extra'] };
    expect(miss(wider)).toBe('missing');
    const bare = app({ withCache: false, installed: false });
    expect(miss(bare)).toBe('missing');
    expect(existsSync(depsOf(bare.root))).toBe(false);
  });

  it('reads a corrupt entry as a miss and never breaks the launch', async () => {
    const cache = tempDir();
    vi.stubEnv('BROCK_BUILD_CACHE_DIR', cache);
    await publish(app());
    const [{ dir }] = entriesOf(cache);
    writeFileSync(join(dir, 'files', 'picker.js'), 'export default 2;');
    const second = app({ withCache: false });
    expect(shareDeps({ config: second.config, rootDir: second.root, store: () => 'started' })).toBe('missing');
    expect(existsSync(depsOf(second.root))).toBe(false);
    writeFileSync(join(dir, 'manifest.json'), '{ not json');
    expect(shareDeps({ config: second.config, rootDir: second.root, store: () => 'started' })).toBe('missing');
  });

  it('does nothing without a pnpm lockfile', () => {
    const root = tempDir();
    put(root, 'package.json', '{}');
    expect(shareDeps({ config: makeConfig(root), rootDir: root, store: () => 'started' })).toBe('no-lockfile');
  });
});
