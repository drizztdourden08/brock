/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONFIG_NAMES, FILE_URL_FRAME } from './data-kind.constants.mjs';

const isConfigFolder = (dir) => CONFIG_NAMES.some((name) => existsSync(join(dir, name)));

const callerConfigFolder = () => {
  for (const frame of (new Error().stack ?? '').split('\n')) {
    const [, url] = FILE_URL_FRAME.exec(frame) ?? [];
    if (url && CONFIG_NAMES.some((name) => url.endsWith(`/${name}`))) return dirname(fileURLToPath(url));
  }
  return null;
};

const nearestConfigFolder = (start) => {
  let current = start;
  for (;;) {
    if (isConfigFolder(current)) return current;
    const parent = dirname(current);
    if (parent === current) return null;
    current = parent;
  }
};

/**
 * @param {string} [cwd] the folder ESLint runs from
 * @returns {string} the config folder
 */
const configRoot = (cwd = process.cwd()) => callerConfigFolder() ?? nearestConfigFolder(cwd) ?? cwd;

export { configRoot };
