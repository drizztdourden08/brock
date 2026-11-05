/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { DEFAULT_DATA_DIR, DEFAULT_OUT_DIR } from './apworld.constants.mjs';

/**
 * @param {string} id The product id
 * @returns {string} a Python module name
 */
const moduleOf = (id) => {
  const name = id.replace(/[^A-Za-z0-9_]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
  return /^[a-z]/.test(name) ? name : `world_${name}`;
};

/**
 * @param {string} rootDir The app root
 * @param {{ product: { id: string, name: string } }} config
 * @param {{ ap?: string[], data?: string, out?: string, module?: string, author?: string, public?: string }} options
 * @returns {{ dataDir: string, outDir: string, publicDir: string | null, moduleName: string, versions: string[], authors: string[], appVersion: string }}
 */
const apworldJob = (rootDir, config, options) => {
  const versions = options.ap ?? [];
  if (!versions.length) throw new Error('give at least one Archipelago version: --ap-version 0.6.2 (repeat it, oldest first)');
  const appVersion = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8')).version;
  return {
    dataDir: resolve(rootDir, options.data ?? DEFAULT_DATA_DIR),
    outDir: resolve(rootDir, options.out ?? DEFAULT_OUT_DIR),
    publicDir: options.public ? resolve(rootDir, options.public) : null,
    moduleName: options.module ?? moduleOf(config.product.id),
    versions,
    authors: [options.author ?? config.product.name],
    appVersion,
  };
};

export { apworldJob };
