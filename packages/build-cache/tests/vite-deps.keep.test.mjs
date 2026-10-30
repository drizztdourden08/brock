/* @layer tooling-scripts @kind test */
import { execFileSync, spawn } from 'node:child_process';
import { readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { listEntries } from '../src/store/list-entries.mjs';
import { hasViteDeps } from '../src/vite-deps/deps-lookup.mjs';
import { restoreViteDeps, storeViteDeps, storeViteDepsDetached } from '../src/vite-deps/vite-deps-cache.mjs';
import { cacheTestTree } from './cache-test-tree.mjs';

vi.mock('node:child_process', async (original) => ({ ...await original(), spawn: vi.fn(() => ({ unref: () => undefined })) }));

const { tempDir, put, cleanup } = cacheTestTree('build-cache-vite-deps-');

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

const STORE_CLI = fileURLToPath(new URL('../src/vite-deps/store-vite-deps-cli.mjs', import.meta.url));
const HASHES = { lockfileHash: 'aaaaaaaa', configHash: 'bbbbbbbb', hash: 'cccccccc' };

const worktree = ({ hashes = HASHES, withDeps = true, shared = false } = {}) => {
  const installRoot = tempDir();
  const packages = shared ? join(tempDir(), 'store') : join(installRoot, 'node_modules/.pnpm');
  const picker = join(packages, 'picker@1.0.0/node_modules/picker/index.js');
  put(installRoot, { 'node_modules/outside.js': 'export default 2;' });
  put(packages, { 'picker@1.0.0/node_modules/picker/index.js': 'export default 1;' });
  if (shared) put(installRoot, { 'node_modules/.modules.yaml': `virtualStoreDir: ${packages}
` });
  const depsDir = join(installRoot, 'node_modules/.vite/deps');
  if (withDeps) {
    const optimized = {
      picker: { src: relative(depsDir, picker).split(sep).join('/'), file: 'picker.js', fileHash: 'f1', needsInterop: false },
      outside: { src: '../../outside.js', file: 'outside.js', fileHash: 'f2', needsInterop: false },
    };
    put(depsDir, { '_metadata.json': JSON.stringify({ ...hashes, browserHash: 'b1', optimized, chunks: { 'chunk-1': { file: 'chunk-1.js' } } }), 'picker.js': 'one', 'outside.js': 'two', 'chunk-1.js': 'three', 'package.json': '{"type":"module"}' });
  }
  return { installRoot, depsDir, packages };
};

const inputOf = (tree, extra = {}) => ({ ...tree, version: '7.3.7', buildKey: 'linux-x64-abc', hashes: HASHES, ...extra });
const entries = (root) => listEntries(root).filter(({ manifest }) => manifest?.kind === 'vite-deps');

describe('vite deps store', () => {
  it('stores a pre-bundle once, as a vite-deps entry with portable sources', async () => {
    const root = tempDir();
    const input = inputOf(worktree(), { root });
    expect(await storeViteDeps(input)).toBe('stored');
    expect(await storeViteDeps(input)).toBe('present');
    const [{ dir, manifest }] = entries(root);
    expect(manifest).toMatchObject({ kind: 'vite-deps', name: 'renderer', version: '7.3.7', buildKey: 'linux-x64-abc', buildSettings: { lockfileHash: HASHES.lockfileHash } });
    expect(hasViteDeps({ root, version: '7.3.7', lockfileHash: HASHES.lockfileHash })).toBe(true);
    expect(hasViteDeps({ root, version: '7.3.7', lockfileHash: 'zzzzzzzz' })).toBe(false);
    expect(hasViteDeps({ root, version: '7.3.8', lockfileHash: HASHES.lockfileHash })).toBe(false);
    const stored = JSON.parse(readFileSync(join(dir, 'files', '_metadata.json'), 'utf8'));
    expect(stored.optimized.picker.src).toBe('@root/node_modules/.pnpm/picker@1.0.0/node_modules/picker/index.js');
    expect(stored.optimized.outside.src).toBe('@root/node_modules/outside.js');
    expect(readFileSync(join(dir, 'files', 'chunk-1.js'), 'utf8')).toBe('three');
  });

  it('is not ready while the metadata is missing, other hashes or a file is gone', async () => {
    const root = tempDir();
    expect(await storeViteDeps(inputOf(worktree({ withDeps: false }), { root }))).toBe('not-ready');
    expect(await storeViteDeps(inputOf(worktree(), { root, hashes: { ...HASHES, configHash: 'zzzzzzzz' } }))).toBe('not-ready');
    const partial = worktree();
    rmSync(join(partial.depsDir, 'chunk-1.js'));
    expect(await storeViteDeps(inputOf(partial, { root }))).toBe('not-ready');
    expect(entries(root)).toEqual([]);
  });
});

describe('vite deps restore', () => {
  const stored = async (root) => {
    await storeViteDeps(inputOf(worktree(), { root }));
    return entries(root)[0].dir;
  };

  it('copies the entry in with the hashes of this worktree and sources under its own install folder', async () => {
    const root = tempDir();
    await stored(root);
    const other = worktree({ withDeps: false });
    const hashes = { lockfileHash: 'dddddddd', configHash: 'eeeeeeee', hash: 'ffffffff' };
    expect(restoreViteDeps(inputOf(other, { root, hashes }))).toBe('restored');
    const metadata = JSON.parse(readFileSync(join(other.depsDir, '_metadata.json'), 'utf8'));
    expect(metadata).toMatchObject({ ...hashes, browserHash: 'b1' });
    expect(metadata.optimized.picker.src).toBe(join(other.installRoot, 'node_modules/.pnpm/picker@1.0.0/node_modules/picker/index.js'));
    expect(readFileSync(join(other.depsDir, 'chunk-1.js'), 'utf8')).toBe('three');
    expect(restoreViteDeps(inputOf(other, { root, hashes }))).toBe('ready');
  });

  it('restores into a worktree whose packages live in a shared store, pointing the source into that store', async () => {
    const root = tempDir();
    await stored(root);
    const cloned = worktree({ withDeps: false, shared: true });
    expect(restoreViteDeps(inputOf(cloned, { root }))).toBe('restored');
    const metadata = JSON.parse(readFileSync(join(cloned.depsDir, '_metadata.json'), 'utf8'));
    expect(metadata.optimized.picker.src).toBe(join(cloned.packages, 'picker@1.0.0/node_modules/picker/index.js'));
  });

  it('stores a pre-bundle made in a shared-store worktree with the same portable sources, and restores it into a normal one', async () => {
    const root = tempDir();
    expect(await storeViteDeps(inputOf(worktree({ shared: true }), { root }))).toBe('stored');
    const [{ dir }] = entries(root);
    expect(JSON.parse(readFileSync(join(dir, 'files', '_metadata.json'), 'utf8')).optimized.picker.src).toBe('@root/node_modules/.pnpm/picker@1.0.0/node_modules/picker/index.js');
    const plain = worktree({ withDeps: false });
    expect(restoreViteDeps(inputOf(plain, { root }))).toBe('restored');
  });

  it('reads a missing source, a damaged file or a broken manifest as a miss and leaves no half folder', async () => {
    const root = tempDir();
    const dir = await stored(root);
    const bare = worktree({ withDeps: false });
    rmSync(join(bare.installRoot, 'node_modules/outside.js'));
    expect(restoreViteDeps(inputOf(bare, { root }))).toBe('missing');
    const damaged = worktree({ withDeps: false });
    writeFileSync(join(dir, 'files', 'picker.js'), 'changed');
    expect(restoreViteDeps(inputOf(damaged, { root }))).toBe('missing');
    writeFileSync(join(dir, 'manifest.json'), '{ broken');
    expect(restoreViteDeps(inputOf(damaged, { root }))).toBe('missing');
    expect(restoreViteDeps(inputOf(worktree({ withDeps: false }), { root: tempDir() }))).toBe('missing');
    expect(() => readFileSync(join(damaged.depsDir, '_metadata.json'))).toThrow();
  });

  it('refuses to restore through a .vite folder that is a link out of the install', async () => {
    const root = tempDir();
    await stored(root);
    const linked = worktree({ withDeps: false });
    symlinkSync(tempDir(), join(linked.installRoot, 'node_modules/.vite'), process.platform === 'win32' ? 'junction' : 'dir');
    expect(restoreViteDeps(inputOf(linked, { root }))).toBe('missing');
  });

  it('keeps entries for another build key apart', async () => {
    const root = tempDir();
    await stored(root);
    expect(restoreViteDeps(inputOf(worktree({ withDeps: false }), { root, buildKey: 'linux-x64-other' }))).toBe('missing');
  });
});

describe('detached store', () => {
  it('stores from a process of its own, and starts none when the entry is there or already started', async () => {
    const root = tempDir();
    const input = inputOf(worktree(), { root });
    execFileSync(process.execPath, [STORE_CLI, JSON.stringify(input)], { env: { ...process.env, BROCK_BUILD_CACHE_DIR: root } });
    expect(entries(root)).toHaveLength(1);
    expect(storeViteDepsDetached(input)).toBe('present');
  });

  it('starts one process for an entry that is not there yet', () => {
    const root = tempDir();
    const input = inputOf(worktree({ withDeps: false }), { root, buildKey: 'linux-x64-fresh' });
    expect(storeViteDepsDetached(input)).toBe('started');
    expect(storeViteDepsDetached(input)).toBe('skipped');
    expect(vi.mocked(spawn)).toHaveBeenCalledTimes(1);
  });
});
