/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, sep } from 'node:path';
import { storeRelativeOf } from '@drizztdourden08/build-cache/vite-deps';
import { PNPM_LOCKFILE, STORE_TOKEN } from './shared-deps-cache.constants.mjs';

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
 * @returns {{ path: string, content: string, installRoot: string } | null} the pnpm lockfile Vite hashes and its install folder
 */
const lockfileOf = (root) => {
  for (let dir = root; ; dir = dirname(dir)) {
    const path = join(dir, PNPM_LOCKFILE);
    if (statSync(path, { throwIfNoEntry: false })?.isFile()) return { path, content: readFileSync(path, 'utf8'), installRoot: dir };
    if (dirname(dir) === dir) return null;
  }
};

const rolldownPart = (options) => ({
  ...options,
  plugins: undefined,
  onLog: undefined,
  onwarn: undefined,
  checks: undefined,
  output: { ...options?.output, plugins: undefined },
});

const esbuildPart = (options) => ({ ...options, plugins: options?.plugins?.map((plugin) => plugin.name) });

const optimizerPart = (optimizeDeps) => ({
  include: sortedUnique(optimizeDeps.include),
  exclude: sortedUnique(optimizeDeps.exclude),
  ...('rolldownOptions' in optimizeDeps ? { rolldownOptions: rolldownPart(optimizeDeps.rolldownOptions) } : { esbuildOptions: esbuildPart(optimizeDeps.esbuildOptions) }),
});

const FS_PREFIX = '/@fs/';
const WINDOWS_DRIVE = /^[A-Za-z]:/;

const fsPathOf = (value) => {
  if (!value.startsWith(FS_PREFIX)) return value;
  const rest = value.slice(FS_PREFIX.length);
  return WINDOWS_DRIVE.test(rest) ? rest : `/${rest}`;
};

const portablePathOf = (root, installRoot) => {
  const inStore = installRoot ? storeRelativeOf(installRoot) : () => null;
  return (value) => {
    if (typeof value !== 'string' || !isAbsolute(value)) return value;
    const path = fsPathOf(value);
    const packaged = inStore(path);
    return packaged === null ? relative(root, path).split(sep).join('/') : `${STORE_TOKEN}/${packaged}`;
  };
};

const aliasEntries = (alias) => (Array.isArray(alias) ? alias : Object.entries(alias ?? {}).map(([find, replacement]) => ({ find, replacement })));

const resolvePart = (resolve, portablePath) => {
  if (!portablePath) return resolve;
  return { ...resolve, alias: aliasEntries(resolve.alias).map(({ find, replacement }) => ({ find, replacement: portablePath(replacement) })) };
};

/**
 * @param {import('vite').ResolvedConfig} config
 * @param {{ portable?: boolean, installRoot?: string }} [options] portable: no root, store paths as tokens
 * @returns {string} Vite's own config hash, rebuilt from the resolved config
 */
const configHashOf = (config, { portable = false, installRoot } = {}) => {
  const client = config.environments?.client ?? config;
  const pick = (key) => client[key] ?? config[key];
  const portablePath = portable ? portablePathOf(config.root, installRoot) : null;
  return getHash(JSON.stringify({
    define: config.keepProcessEnv ? null : process.env.NODE_ENV || config.mode,
    root: portable ? '' : config.root,
    resolve: resolvePart(pick('resolve'), portablePath),
    assetsInclude: config.assetsInclude,
    plugins: pick('plugins').map((plugin) => plugin.name),
    optimizeDeps: optimizerPart(pick('optimizeDeps')),
    optimizeDepsPluginNames: pick('optimizeDepsPluginNames'),
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
