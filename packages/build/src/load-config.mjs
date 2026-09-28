/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { CONFIG_FILE } from './config.mjs';

/**
 * @typedef {import('./config.mjs').BrockConfig} BrockConfig
 */

/**
 * @param {string} rootDir
 * @returns {Promise<BrockConfig>}
 */
const loadBrockConfig = async (rootDir) => {
  const file = join(rootDir, CONFIG_FILE);
  if (!existsSync(file)) throw new Error(`No ${CONFIG_FILE} in ${rootDir}`);
  const loaded = await import(pathToFileURL(file).href);
  const cfg = loaded.default;
  if (!cfg || typeof cfg !== 'object') throw new Error(`${CONFIG_FILE} must default-export defineBrockConfig({ ... })`);
  if (!cfg.product?.id) throw new Error(`${CONFIG_FILE}: product.id is missing`);
  return { targets: ['desktop'], modules: [], ...cfg };
};

export { loadBrockConfig };
