/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { treeFiles } from './changed-files.mjs';
import { CACHE_DIR_ENV, TYPES_STAMP_FILES } from './lint.constants.mjs';

const typesStamp = (rootDir) => {
  const files = treeFiles(rootDir);
  if (!files) return null;
  const hash = createHash('sha256');
  for (const file of files.filter((name) => TYPES_STAMP_FILES.test(name))) {
    hash.update(`${file}\0`).update(readFileSync(join(rootDir, file))).update('\0');
  }
  return hash.digest('hex').slice(0, 16);
};

const dropStale = (dir, name, keep) => {
  const old = new RegExp(`^eslint-${name}-[0-9a-f]{16}\\.json$`);
  for (const entry of readdirSync(dir)) if (old.test(entry) && entry !== keep) rmSync(join(dir, entry), { force: true });
};

/**
 * @param {string} rootDir the folder eslint runs in
 * @param {string} name which run the cache belongs to
 * @param {NodeJS.ProcessEnv} env BROCK_LINT_CACHE_DIR moves the folder
 * @returns {string | null} the cache file, null when types cannot be stamped
 */
const lintCacheFile = (rootDir, name, env) => {
  const stamp = typesStamp(rootDir);
  if (!stamp) return null;
  const dir = resolve(env[CACHE_DIR_ENV] ?? join(rootDir, 'node_modules', '.cache', 'brock'));
  mkdirSync(dir, { recursive: true });
  const file = `eslint-${name}-${stamp}.json`;
  dropStale(dir, name, file);
  return join(dir, file);
};

export { lintCacheFile };
