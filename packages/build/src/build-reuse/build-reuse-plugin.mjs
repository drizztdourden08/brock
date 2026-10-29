/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { virtualStoreOf } from '../shared-deps-cache/virtual-store-of.mjs';
import { findWorkspaceRoot } from '../workspace.mjs';
import { DEV_MODE, MODE_ENV, VIRTUAL_PREFIX } from './build-reuse.constants.mjs';
import { configKey } from './config-key.mjs';
import { moduleKeys, repoKeysCurrent } from './module-keys.mjs';
import { repoSnapshot } from './repo-snapshot.mjs';
import { reuseKey } from './reuse-key.mjs';
import { readStore, storeFile, storeIsCurrent, writeStore } from './reuse-store.mjs';
import { stubInput } from './stub-input.mjs';

const encode = (item) => ({ fileName: item.fileName, base64: Buffer.from(item.type === 'chunk' ? item.code : item.source).toString('base64') });

/**
 * @param {Record<string, any>} bundle the written bundle
 * @returns {{ fileName: string, base64: string }[] | null} every output, null with a source map
 */
const outputsOf = (bundle) => {
  const items = Object.values(bundle);
  if (items.some((item) => item.type === 'chunk' && item.map)) return null;
  return items.map(encode);
};

/**
 * @param {string} rootDir the app root
 * @returns {string | null} pnpm's package store for the app, wherever .modules.yaml puts it
 */
const packageStoreOf = (rootDir) => {
  const workspace = findWorkspaceRoot(rootDir) ?? rootDir;
  const lockfile = join(workspace, 'node_modules', '.pnpm', 'lock.yaml');
  return existsSync(lockfile) ? virtualStoreOf(lockfile) : null;
};

/**
 * @param {Record<string, any>} store the bundle being reused
 * @param {import('./repo-snapshot.mjs').RepoSnapshot | null} snapshot
 * @returns {string[]} every file the bundle read, so watch mode rebuilds when one changes
 */
const watchedFiles = (store, snapshot) => [
  ...Object.keys(store.files ?? {}),
  ...(snapshot ? Object.keys(store.repo ?? {}).map((rel) => join(snapshot.top, rel)) : []),
];

/**
 * @param {import('./module-keys.mjs').ModuleKeys} keys taken from the snapshot at the start of the build
 * @param {import('./repo-snapshot.mjs').RepoSnapshot | null} snapshot
 * @param {string} rootDir
 * @returns {boolean} true when no repository file the build read changed while it ran
 */
const unchangedSince = (keys, snapshot, rootDir) => !snapshot || repoKeysCurrent(keys, repoSnapshot(rootDir));

/**
 * @param {{ rootDir: string, target: 'main' | 'preload' }} opts the app root and which bundle this is
 * @returns {import('vite').Plugin} writes the last bundle while no input changed
 */
const buildReusePlugin = ({ rootDir, target }) => {
  let enabled = false;
  let logger = null;
  let reusing = null;
  let key = '';
  let configPart = {};
  let startedAt = 0;
  let snapshot = null;
  const file = storeFile(rootDir, target);
  return {
    name: `brock:build-reuse-${target}`,
    enforce: 'pre',
    configResolved: (config) => {
      enabled = config.command === 'build' && process.env[MODE_ENV] === DEV_MODE;
      logger = config.logger;
      configPart = enabled ? configKey(config, rootDir) : {};
    },
    options(options) {
      if (!enabled) return null;
      startedAt = Date.now();
      key = reuseKey(rootDir, target, configPart);
      snapshot = repoSnapshot(rootDir);
      const store = readStore(file);
      reusing = storeIsCurrent(store, key, { snapshot }) ? store : null;
      return reusing ? { ...options, input: stubInput(options.input) } : null;
    },
    buildStart() {
      if (!reusing) return;
      for (const path of watchedFiles(reusing, snapshot)) this.addWatchFile(path);
    },
    resolveId: (id) => (reusing && id.startsWith(VIRTUAL_PREFIX) ? id : null),
    load: (id) => (reusing && id.startsWith(VIRTUAL_PREFIX) ? 'export {};' : null),
    generateBundle(_options, bundle) {
      if (!reusing) return;
      for (const name of Object.keys(bundle)) delete bundle[name];
      for (const { fileName, base64 } of reusing.outputs) this.emitFile({ type: 'asset', fileName, source: Buffer.from(base64, 'base64') });
      logger?.info(`brock: reused the ${target} bundle, no input changed`);
    },
    writeBundle(_options, bundle) {
      if (!enabled || reusing) return;
      const outputs = outputsOf(bundle);
      const keys = moduleKeys(this.getModuleIds(), startedAt, { snapshot, packages: packageStoreOf(rootDir), skipDirs: [rootDir] });
      if (outputs && unchangedSince(keys, snapshot, rootDir)) writeStore(file, { key, ...keys, outputs });
    },
  };
};

export { buildReusePlugin };
