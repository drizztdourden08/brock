/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { PNPM_LOCKFILE } from './shared-deps-cache.constants.mjs';

/**
 * @param {string} text
 * @param {number} [length]
 * @returns {string} the short hash Vite writes into the metadata
 */
const getHash = (text, length = 8) => createHash('sha256').update(text).digest('hex').substring(0, length);

const sortedUnique = (list) => (list ? [...new Set(list)].sort() : undefined);

const replacer = (_key, value) => (typeof value === 'function' || value instanceof RegExp ? value.toString() : value);

/**
 * @param {string} root the folder Vite resolves the renderer from
 * @returns {{ path: string, content: string } | null} the pnpm lockfile Vite hashes
 */
const lockfileOf = (root) => {
  for (let dir = root; ; dir = dirname(dir)) {
    const path = join(dir, PNPM_LOCKFILE);
    if (statSync(path, { throwIfNoEntry: false })?.isFile()) return { path, content: readFileSync(path, 'utf8') };
    if (dirname(dir) === dir) return null;
  }
};

const optimizerPart = (optimizeDeps) => ({
  include: sortedUnique(optimizeDeps.include),
  exclude: sortedUnique(optimizeDeps.exclude),
  esbuildOptions: {
    ...optimizeDeps.esbuildOptions,
    plugins: optimizeDeps.esbuildOptions?.plugins?.map((plugin) => plugin.name),
  },
});

const resolvePart = (resolve, portable) => (portable ? { ...resolve, alias: undefined } : resolve);

/**
 * @param {import('vite').ResolvedConfig} config
 * @param {{ portable?: boolean }} [options] portable drops the root and the alias folders
 * @returns {string} Vite's own config hash, rebuilt from the resolved config
 */
const configHashOf = (config, { portable = false } = {}) => {
  const client = config.environments?.client ?? config;
  return getHash(JSON.stringify({
    define: config.keepProcessEnv ? null : process.env.NODE_ENV || config.mode,
    root: portable ? '' : config.root,
    resolve: resolvePart(client.resolve ?? config.resolve, portable),
    assetsInclude: config.assetsInclude,
    plugins: config.plugins.map((plugin) => plugin.name),
    optimizeDeps: optimizerPart(client.optimizeDeps ?? config.optimizeDeps),
  }, replacer));
};

/**
 * @param {import('vite').ResolvedConfig} config
 * @param {{ content: string }} lockfile
 * @returns {{ lockfileHash: string, configHash: string, hash: string }} the three hashes Vite writes for this worktree
 */
const viteHashes = (config, lockfile) => {
  const lockfileHash = getHash(lockfile.content);
  const configHash = configHashOf(config);
  return { lockfileHash, configHash, hash: getHash(lockfileHash + configHash) };
};

export { configHashOf, getHash, lockfileOf, viteHashes };
