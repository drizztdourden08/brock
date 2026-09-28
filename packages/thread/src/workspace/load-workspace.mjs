/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { defineWorkspace } from './define-workspace.mjs';
import { WORKSPACE_FILE } from './define-workspace.constants.mjs';
import { electronTarget } from '../launch/electron-target.mjs';

const APP_MARKER = 'brock.config.ts';

const fallbackName = (rootDir) => {
  try {
    const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
    return String(pkg.name ?? basename(rootDir)).replace(/^@[^/]+\//, '').replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  } catch {
    return basename(rootDir).toLowerCase();
  }
};

const implicitWorkspace = (rootDir) => {
  const targets = existsSync(join(rootDir, APP_MARKER)) ? { app: electronTarget({ app: '.' }) } : {};
  return defineWorkspace({ name: fallbackName(rootDir), targets });
};

/**
 * @param {string} rootDir the main checkout
 * @returns {Promise<import('./workspace.type.mjs').Workspace>}
 */
const loadWorkspace = async (rootDir) => {
  const file = join(rootDir, WORKSPACE_FILE);
  if (!existsSync(file)) return implicitWorkspace(rootDir);
  const loaded = (await import(pathToFileURL(file).href)).default;
  if (!loaded || typeof loaded !== 'object' || !loaded.name) throw new Error(`${WORKSPACE_FILE}: export default defineWorkspace({ ... }) is missing.`);
  return loaded;
};

export { loadWorkspace };
