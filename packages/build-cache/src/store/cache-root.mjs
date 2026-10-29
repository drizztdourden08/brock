/* @layer tooling-scripts @kind logic */
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { CACHE_ENV, CACHE_FOLDERS } from './store.constants.mjs';

/**
 * @param {Record<string, string | undefined>} [env]
 * @returns {string} the per-user cache root, BROCK_BUILD_CACHE_DIR when set
 */
const cacheRoot = (env = process.env) => (env[CACHE_ENV] ? resolve(env[CACHE_ENV]) : join(homedir(), ...CACHE_FOLDERS));

export { cacheRoot };
