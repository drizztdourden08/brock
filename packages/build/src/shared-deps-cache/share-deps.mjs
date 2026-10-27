/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { readMetadata } from './deps-metadata.mjs';
import { DEPS_FOLDER } from './shared-deps-cache.constants.mjs';
import { publishDeps, seedDeps, shareKey, sharedCacheRoot } from './share-store.mjs';
import { configHashOf, lockfileOf, viteHashes } from './vite-hash.mjs';

const viteVersionOf = (rootDir) => {
  try {
    return JSON.parse(readFileSync(createRequire(join(rootDir, 'package.json')).resolve('vite/package.json'), 'utf8')).version ?? null;
  } catch {
    return null;
  }
};

/**
 * @param {{ config: import('vite').ResolvedConfig, rootDir: string, sharedRoot?: string }} input the dev server config and the app root
 * @returns {'no-lockfile' | 'no-vite' | 'published' | 'present' | 'seeded' | 'missing' | 'rejected' | 'skipped'} what happened
 */
const shareDeps = ({ config, rootDir, sharedRoot = sharedCacheRoot() }) => {
  const lockfile = lockfileOf(config.root);
  const vite = viteVersionOf(rootDir);
  if (!lockfile) return 'no-lockfile';
  if (!vite) return 'no-vite';
  const hashes = viteHashes(config, lockfile);
  const depsDir = join(config.cacheDir, DEPS_FOLDER);
  const key = shareKey({ vite, lockfile, configHash: configHashOf(config, { portable: true }) });
  const input = { root: sharedRoot, key, depsDir, store: dirname(lockfile.path), hashes };
  return readMetadata(depsDir) ? publishDeps(input) : seedDeps(input);
};

export { shareDeps };
