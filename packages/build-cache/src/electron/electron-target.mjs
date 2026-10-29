/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { ARCH_SOURCES, NPMRC_FILE, PLATFORM_SOURCES } from './electron-cache.constants.mjs';

const valueIn = (file, key) => {
  try {
    const found = new RegExp(`^\\s*${key}\\s*=\\s*([^\\s#;]+)`, 'm').exec(readFileSync(file, 'utf8'));
    return found ? found[1] : null;
  } catch {
    return null;
  }
};

/**
 * @param {string} startDir
 * @param {string} key an .npmrc setting
 * @param {string} [home]
 * @returns {string | null} the nearest project .npmrc value, else the user one
 */
const npmrcValue = (startDir, key, home = homedir()) => {
  for (let dir = startDir; ; dir = dirname(dir)) {
    const value = valueIn(join(dir, NPMRC_FILE), key);
    if (value) return value;
    if (dirname(dir) === dir) return valueIn(join(home, NPMRC_FILE), key);
  }
};

const pick = (packageDir, env, { env: names, npmrc }, fallback) => names.map((name) => env[name]).find(Boolean) ?? npmrcValue(packageDir, npmrc) ?? fallback;

/**
 * @param {string} packageDir the installed electron package folder
 * @param {Record<string, string | undefined>} [env]
 * @returns {{ platform: string, arch: string }} what install.js would download
 */
const electronTarget = (packageDir, env = process.env) => ({
  platform: pick(packageDir, env, PLATFORM_SOURCES, process.platform),
  arch: pick(packageDir, env, ARCH_SOURCES, process.arch),
});

export { electronTarget };
