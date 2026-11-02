/* @layer tooling-scripts @kind test */
import { join } from 'node:path';
import { storeViteDeps } from '@drizztdourden08/build-cache/vite-deps';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MODE_ENV } from '../src/build-reuse/build-reuse.constants.mjs';
import { getHash } from '../src/shared-deps-cache/vite-hash.mjs';
import { tempTree } from './temp-tree.mjs';

const state = vi.hoisted(() => ({ hit: true, imported: [] }));

vi.mock('../src/build-reuse/shared-build/restore-shared-build.mjs', () => ({ restoreSharedBuild: () => ({ hit: state.hit, missed: [] }) }));
vi.mock('../src/ensure-electron.mjs', () => ({ ensureElectron: () => ({ ok: true }) }));
vi.mock('../src/freshness/ensure-synced.mjs', () => ({ ensureSyncedLater: async () => ({}) }));
vi.mock('../src/import-from-app.mjs', () => ({
  importFromApp: async (_root, name) => {
    state.imported.push(name);
    return name === 'vite' ? {} : { resolveConfig: async () => ({ config: {} }) };
  },
}));

const { runPrewarm } = await import('../src/commands/prewarm.mjs');
const { tempDir, put, cleanup } = tempTree('brock-prewarm-skip-');

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  Object.assign(state, { hit: true, imported: [] });
});

const LOCKFILE = 'lockfileVersion: 9\npackages:\n  picker@1.0.0: {}\n';

const app = (lockfile = LOCKFILE) => {
  const root = tempDir();
  put(root, 'package.json', '{"name":"app"}');
  put(root, 'node_modules/vite/package.json', '{"name":"vite","version":"7.3.7"}');
  put(root, 'node_modules/.pnpm/lock.yaml', lockfile);
  return root;
};

const cacheEntryFor = async (lockfile) => {
  const root = app(lockfile);
  const hashes = { lockfileHash: getHash(lockfile), configHash: 'bbbbbbbb', hash: 'cccccccc' };
  put(root, 'node_modules/.vite/deps/_metadata.json', JSON.stringify({ ...hashes, browserHash: 'b1', optimized: {}, chunks: {} }));
  const depsDir = join(root, 'node_modules/.vite/deps');
  expect(await storeViteDeps({ depsDir, installRoot: root, version: '7.3.7', buildKey: 'linux-x64-abc', hashes })).toBe('stored');
};

const prewarm = async (rootDir) => {
  vi.stubEnv(MODE_ENV, '');
  const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  const code = await runPrewarm({ rootDir });
  return { code, lines: log.mock.calls.map(([line]) => line) };
};

describe('S2 the prewarm skip of the renderer pre-bundle', { tags: ['standard'] }, () => {
  it('skips on a build reuse hit when an entry holds this Vite version and lockfile, without importing Vite', async () => {
    vi.stubEnv('BROCK_BUILD_CACHE_DIR', tempDir());
    await cacheEntryFor(LOCKFILE);
    const { code, lines } = await prewarm(app());
    expect(code).toBe(0);
    expect(state.imported).toEqual([]);
    expect(lines.join('\n')).toContain('come from the build cache when the app starts');
  });

  it('does not skip when the only entry is for another lockfile, and loads Vite then', async () => {
    vi.stubEnv('BROCK_BUILD_CACHE_DIR', tempDir());
    await cacheEntryFor(`${LOCKFILE}  other@2.0.0: {}\n`);
    const { code, lines } = await prewarm(app());
    expect(code).toBe(0);
    expect(state.imported).toEqual(expect.arrayContaining(['vite', 'electron-vite']));
    expect(lines.join('\n')).not.toContain('come from the build cache');
  });

  it('does not skip without a build reuse hit', async () => {
    vi.stubEnv('BROCK_BUILD_CACHE_DIR', tempDir());
    await cacheEntryFor(LOCKFILE);
    state.hit = false;
    await prewarm(app());
    expect(state.imported).toContain('vite');
  });
});
