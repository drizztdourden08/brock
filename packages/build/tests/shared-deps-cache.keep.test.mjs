/* @layer tooling-scripts @kind test */
import { existsSync, mkdirSync, readFileSync, readdirSync, utimesSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { shareDeps } from '../src/shared-deps-cache/share-deps.mjs';
import { publishDeps, seedDeps, shareKey } from '../src/shared-deps-cache/share-store.mjs';
import { configHashOf, viteHashes } from '../src/shared-deps-cache/vite-hash.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-shared-deps-');

afterEach(cleanup);

const LOCKFILE = 'lockfileVersion: 9\npackages:\n  picker@1.0.0: {}\n';

const metadataFor = (hashes, extra = {}) => JSON.stringify({
  ...hashes,
  browserHash: 'b1',
  optimized: { picker: { src: '../../.pnpm/picker@1.0.0/node_modules/picker/index.js', file: 'picker.js', fileHash: 'f1', needsInterop: false } },
  chunks: {},
  ...extra,
});

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

const app = ({ version = '1.0.0', lockfile = LOCKFILE, withCache = true } = {}) => {
  const root = tempDir();
  put(root, 'package.json', '{"name":"app"}');
  put(root, 'src/index.html', '');
  put(root, 'node_modules/vite/package.json', '{"name":"vite","version":"7.3.7"}');
  put(root, 'node_modules/.pnpm/lock.yaml', lockfile);
  put(root, `node_modules/.pnpm/picker@${version}/node_modules/picker/package.json`, JSON.stringify({ name: 'picker', version }));
  put(root, `node_modules/.pnpm/picker@${version}/node_modules/picker/index.js`, 'export default 1;');
  const config = makeConfig(root);
  if (withCache) {
    const hashes = viteHashes(config, { content: lockfile });
    put(root, 'node_modules/.vite/deps/_metadata.json', metadataFor(hashes));
    put(root, 'node_modules/.vite/deps/picker.js', 'export default 1;');
    put(root, 'node_modules/.vite/deps/package.json', '{"type":"module"}');
  }
  return { root, config };
};

const metadataOf = (root) => JSON.parse(readFileSync(join(root, 'node_modules/.vite/deps/_metadata.json'), 'utf8'));

describe('configHashOf', () => {
  it('names the worktree unless portable, and always names the optimizer inputs', () => {
    const one = makeConfig(tempDir());
    const two = makeConfig(tempDir());
    expect(configHashOf(one)).not.toBe(configHashOf(two));
    expect(configHashOf(one, { portable: true })).toBe(configHashOf(two, { portable: true }));
    expect(configHashOf({ ...one, optimizeDeps: { include: ['react', 'bar'] } }, { portable: true })).not.toBe(configHashOf(one, { portable: true }));
    expect(configHashOf({ ...one, plugins: [{ name: 'other' }] }, { portable: true })).not.toBe(configHashOf(one, { portable: true }));
  });

  it('does not depend on the order or the repeats of the include list', () => {
    const base = makeConfig(tempDir());
    expect(configHashOf({ ...base, optimizeDeps: { include: ['picker', 'react', 'picker'] } })).toBe(configHashOf(base));
  });
});

describe('shareKey', () => {
  const parts = { vite: '7.3.7', lockfile: { content: LOCKFILE }, configHash: 'abc' };

  it('moves with the lockfile content, the Vite version and the optimizer config, and nothing else', () => {
    expect(shareKey({ ...parts })).toBe(shareKey({ ...parts, lockfile: { content: LOCKFILE } }));
    expect(shareKey({ ...parts, lockfile: { content: `${LOCKFILE}  bar@2.0.0: {}\n` } })).not.toBe(shareKey(parts));
    expect(shareKey({ ...parts, vite: '7.3.8' })).not.toBe(shareKey(parts));
    expect(shareKey({ ...parts, configHash: 'abd' })).not.toBe(shareKey(parts));
  });
});

const inputFor = ({ root, config }, shared, lockfile = LOCKFILE) => {
  const hashes = viteHashes(config, { content: lockfile });
  return { root: shared, key: 'key1', depsDir: join(root, 'node_modules/.vite/deps'), store: join(root, 'node_modules/.pnpm'), hashes };
};

describe('publishDeps', () => {
  it('copies a current cache into the shared folder once, and seeds an empty worktree from it with that worktree hashes', () => {
    const shared = tempDir();
    const first = app();
    expect(publishDeps(inputFor(first, shared))).toBe('published');
    expect(publishDeps(inputFor(first, shared))).toBe('present');
    expect(existsSync(join(shared, 'key1/deps/picker.js'))).toBe(true);

    const second = app({ withCache: false });
    const input = inputFor(second, shared);
    expect(seedDeps(input)).toBe('seeded');
    const seeded = metadataOf(second.root);
    expect(seeded.hash).toBe(input.hashes.hash);
    expect(seeded.configHash).toBe(input.hashes.configHash);
    expect(seeded.optimized.picker.src).toBe('../../.pnpm/picker@1.0.0/node_modules/picker/index.js');
    expect(readFileSync(join(second.root, 'node_modules/.vite/deps/picker.js'), 'utf8')).toBe('export default 1;');
    expect(readdirSync(join(second.root, 'node_modules/.vite')).filter((name) => name.includes('seed'))).toEqual([]);
  });

  it('does not publish a cache whose hashes are not the ones Vite would write for this config', () => {
    const shared = tempDir();
    const stale = app();
    const input = inputFor(stale, shared);
    writeFileSync(join(input.depsDir, '_metadata.json'), metadataFor({ ...input.hashes, configHash: 'zzzzzzzz' }));
    expect(publishDeps(input)).toBe('skipped');
    expect(existsSync(join(shared, 'key1'))).toBe(false);
  });

  it('does not publish a cache that reaches outside the pnpm store', () => {
    const shared = tempDir();
    const linked = app();
    const input = inputFor(linked, shared);
    put(linked.root, 'node_modules/zod/package.json', '{"name":"zod","version":"3.0.0"}');
    put(linked.root, 'node_modules/zod/index.js', '');
    const src = '../../zod/index.js';
    writeFileSync(join(input.depsDir, '_metadata.json'), metadataFor(input.hashes, { optimized: { zod: { src, file: 'zod.js', fileHash: 'z1', needsInterop: false } } }));
    expect(publishDeps(input)).toBe('skipped');
  });

  it('keeps only the newest entries', () => {
    const shared = tempDir();
    const source = app();
    for (let index = 0; index < 9; index += 1) {
      expect(publishDeps({ ...inputFor(source, shared), key: `key${index}` })).toBe('published');
      const when = new Date(Date.now() - (9 - index) * 60_000);
      utimesSync(join(shared, `key${index}`), when, when);
    }
    const kept = readdirSync(shared).sort();
    expect(kept).toHaveLength(6);
    expect(kept).not.toContain('key0');
    expect(kept).toContain('key8');
  });
});

describe('seedDeps', () => {
  it('rejects a seed when a dependency is at another version here', () => {
    const shared = tempDir();
    expect(publishDeps(inputFor(app(), shared))).toBe('published');
    const other = app({ version: '1.0.1', withCache: false });
    put(other.root, 'node_modules/.pnpm/picker@1.0.0/node_modules/picker/package.json', JSON.stringify({ name: 'picker', version: '1.0.1' }));
    put(other.root, 'node_modules/.pnpm/picker@1.0.0/node_modules/picker/index.js', '');
    expect(seedDeps(inputFor(other, shared))).toBe('rejected');
    expect(existsSync(join(other.root, 'node_modules/.vite/deps'))).toBe(false);
  });

  it('rejects a seed when a dependency is not installed here', () => {
    const shared = tempDir();
    expect(publishDeps(inputFor(app(), shared))).toBe('published');
    const bare = app({ version: '2.0.0', withCache: false });
    expect(seedDeps(inputFor(bare, shared))).toBe('rejected');
  });

  it('finds nothing to seed from when the key has no entry', () => {
    expect(seedDeps(inputFor(app({ withCache: false }), tempDir()))).toBe('missing');
  });
});

describe('shareDeps', () => {
  it('publishes a current cache, then seeds a second worktree with the same lockfile', () => {
    const shared = tempDir();
    const first = app();
    expect(shareDeps({ config: first.config, rootDir: first.root, sharedRoot: shared })).toBe('published');
    const second = app({ withCache: false });
    expect(shareDeps({ config: second.config, rootDir: second.root, sharedRoot: shared })).toBe('seeded');
    expect(metadataOf(second.root).hash).toBe(viteHashes(second.config, { content: LOCKFILE }).hash);
    expect(shareDeps({ config: second.config, rootDir: second.root, sharedRoot: shared })).toBe('present');
  });

  it('shares nothing between worktrees with different lockfiles or different optimizer includes', () => {
    const shared = tempDir();
    const first = app();
    shareDeps({ config: first.config, rootDir: first.root, sharedRoot: shared });
    const lockfile = `${LOCKFILE}  bar@2.0.0: {}\n`;
    const newer = app({ lockfile, withCache: false });
    expect(shareDeps({ config: newer.config, rootDir: newer.root, sharedRoot: shared })).toBe('missing');
    const wider = app({ withCache: false });
    wider.config.optimizeDeps = { include: ['react', 'picker', 'extra'] };
    expect(shareDeps({ config: wider.config, rootDir: wider.root, sharedRoot: shared })).toBe('missing');
  });

  it('does nothing without a pnpm lockfile', () => {
    const root = tempDir();
    put(root, 'package.json', '{}');
    put(root, 'node_modules/vite/package.json', '{"name":"vite","version":"7.3.7"}');
    mkdirSync(join(root, 'src'), { recursive: true });
    expect(shareDeps({ config: makeConfig(root), rootDir: root, sharedRoot: tempDir() })).toBe('no-lockfile');
  });

  it('leaves the folder of an unrelated stale cache alone', () => {
    const shared = tempDir();
    const stale = app();
    writeFileSync(join(stale.root, 'node_modules/.vite/deps/_metadata.json'), metadataFor({ hash: 'old', configHash: 'old', lockfileHash: 'old' }));
    expect(shareDeps({ config: stale.config, rootDir: stale.root, sharedRoot: shared })).toBe('skipped');
    expect(metadataOf(stale.root).hash).toBe('old');
  });
});
