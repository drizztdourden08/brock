/* @layer tooling-scripts @kind test */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { storeViteDeps, storeViteDepsDetached } from '@drizztdourden08/build-cache/vite-deps';
import * as vite from 'vite';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { shareDeps } from '../src/shared-deps-cache/share-deps.mjs';
import { depsReady, sharedDepsCachePlugin } from '../src/shared-deps-cache/shared-deps-cache-plugin.mjs';
import { PLUGIN_NAME } from '../src/shared-deps-cache/shared-deps-cache.constants.mjs';
import { serveConfig, storeInstall } from './store-install.mjs';
import { tempTree } from './temp-tree.mjs';

vi.mock('@drizztdourden08/build-cache/vite-deps', async (original) => ({ ...await original(), storeViteDepsDetached: vi.fn(() => 'skipped') }));

const tree = tempTree('brock-deps-start-');

afterEach(() => {
  tree.cleanup();
  vi.unstubAllEnvs();
  vi.mocked(storeViteDepsDetached).mockClear();
});

const SENTINEL = 'export const answer = "from the build cache";\n';

const resolved = ({ root }, plugin, include) => serveConfig(root, [plugin], include);

const depFile = ({ root }) => join(root, 'node_modules/.vite/deps/dummy-dep.js');

const publish = async (install) => {
  const config = await resolved(install, { name: PLUGIN_NAME });
  await vite.optimizeDeps(config, true);
  writeFileSync(depFile(install), SENTINEL);
  const stored = [];
  shareDeps({ config, rootDir: install.root, store: (input) => stored.push(input) });
  return { browserHash: JSON.parse(readFileSync(join(install.root, 'node_modules/.vite/deps/_metadata.json'), 'utf8')).browserHash, outcome: await storeViteDeps(stored[0]) };
};

describe('the dev start restores the pre-bundle', () => {
  it('makes Vite skip optimizeDeps in a fresh worktree on another package store', { timeout: 120_000 }, async () => {
    vi.stubEnv('BROCK_BUILD_CACHE_DIR', tree.tempDir());
    const { browserHash, outcome } = await publish(storeInstall(tree));
    expect(outcome).toBe('stored');

    const fresh = storeInstall(tree, { depth: 2 });
    const config = await resolved(fresh, sharedDepsCachePlugin({ rootDir: fresh.root }));
    expect(depsReady(config)).toBe(true);
    expect(storeViteDepsDetached).not.toHaveBeenCalled();
    const metadata = await vite.optimizeDeps(config, false);
    expect(metadata.browserHash).toBe(browserHash);
    expect(readFileSync(depFile(fresh), 'utf8')).toBe(SENTINEL);
  });

  it('is not ready, and Vite bundles, when only another key has an entry', { timeout: 120_000 }, async () => {
    vi.stubEnv('BROCK_BUILD_CACHE_DIR', tree.tempDir());
    expect((await publish(storeInstall(tree))).outcome).toBe('stored');

    const other = storeInstall(tree);
    const config = await resolved(other, sharedDepsCachePlugin({ rootDir: other.root }), ['dummy-dep', 'dummy-dep/index.js']);
    expect(depsReady(config)).toBe(false);
    expect(storeViteDepsDetached).toHaveBeenCalledTimes(1);
    await vite.optimizeDeps(config, false);
    expect(readFileSync(depFile(other), 'utf8')).not.toBe(SENTINEL);
  });
});
