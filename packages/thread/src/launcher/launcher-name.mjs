/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const WORKSPACE_NAME = /\bname:\s*['"]([a-z][a-z0-9-]*)['"]/;

/**
 * @param {string} rootDir
 * @param {string} scope
 * @returns {string} the brock.workspace.mjs name, else the scope without @
 */
const launcherName = (rootDir, scope) => {
  const file = join(rootDir, 'brock.workspace.mjs');
  const declared = existsSync(file) ? WORKSPACE_NAME.exec(readFileSync(file, 'utf8')) : null;
  return declared?.[1] ?? scope.replace(/^@/, '');
};

export { launcherName };
