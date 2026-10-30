/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { restoreViteDeps, storeViteDepsDetached } from '@drizztdourden08/build-cache/vite-deps';
import { DEPS_FOLDER, KEY_LENGTH, KEY_VERSION, REPORTED } from './shared-deps-cache.constants.mjs';
import { configHashOf, getHash, lockfileOf, viteHashes } from './vite-hash.mjs';

const viteVersionOf =(rootDir) => {
  try {
    return JSON.parse(readFileSync(createRequire(join(rootDir, 'package.json')).resolve('vite/package.json'), 'utf8')).version ?? null;
  } catch {
    return null;
  }
};

/**
 * @param {{ vite: string, lockfile: { content: string }, configHash: string }} parts what the pre-bundle depends on
 * @returns {string} the build key worktrees with the same inputs share
 */
const depsBuildKey = ({ vite, lockfile, configHash }) => {
  const parts = JSON.stringify({ version: KEY_VERSION, vite, platform: `${process.platform}-${process.arch}`, lockfile: getHash(lockfile.content, 40), configHash });
  return `${process.platform}-${process.arch}-${getHash(parts, KEY_LENGTH)}`;
};

/**
 * @param {{ config: import('vite').ResolvedConfig, rootDir: string, store?: typeof storeViteDepsDetached }} input the dev server config and the app root
 * @returns {'no-lockfile' | 'no-vite' | 'seeded' | 'present' | 'missing'} seeded: the folder came from the build cache
 */
const shareDeps = ({ config, rootDir, store = storeViteDepsDetached }) => {
  const lockfile = lockfileOf(config.root);
  const version = viteVersionOf(rootDir);
  if (!lockfile) return 'no-lockfile';
  if (!version) return 'no-vite';
  const buildKey = depsBuildKey({ vite: version, lockfile, configHash: configHashOf(config, { portable: true, installRoot: lockfile.installRoot }) });
  const input = { depsDir: join(config.cacheDir, DEPS_FOLDER), installRoot: lockfile.installRoot, version, buildKey, hashes: viteHashes(config, lockfile) };
  const outcome = restoreViteDeps(input);
  if (outcome !== 'restored') store(input);
  return REPORTED[outcome];
};

export { depsBuildKey, shareDeps, viteVersionOf };
