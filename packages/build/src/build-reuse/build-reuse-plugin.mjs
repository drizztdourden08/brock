/* @layer tooling-scripts @kind logic */
import { DEV_MODE, MODE_ENV, VIRTUAL_PREFIX } from './build-reuse.constants.mjs';
import { configKey } from './config-key.mjs';
import { moduleStamps } from './module-stamps.mjs';
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
      const store = readStore(file);
      reusing = storeIsCurrent(store, key) ? store : null;
      return reusing ? { ...options, input: stubInput(options.input) } : null;
    },
    buildStart() {
      if (!reusing) return;
      for (const path of Object.keys(reusing.files)) this.addWatchFile(path);
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
      if (outputs) writeStore(file, { key, ...moduleStamps(this.getModuleIds(), startedAt, undefined, [rootDir]), outputs });
    },
  };
};

export { buildReusePlugin };
