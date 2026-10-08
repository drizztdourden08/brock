/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { findWorkspaceRoot } from '../workspace.mjs';

const pinIn = (dir) => {
  const file = join(dir, 'package.json');
  if (!existsSync(file)) return null;
  const version = JSON.parse(readFileSync(file, 'utf8')).brock?.version;
  return typeof version === 'string' ? version : null;
};

/**
 * @param {string} rootDir the app folder
 * @returns {string | null} its package.json brock.version, else the workspace root's; null when the app was never on Brock
 */
const brockPinOf = (rootDir) => {
  const repoRoot = findWorkspaceRoot(rootDir);
  return pinIn(rootDir) ?? (repoRoot ? pinIn(repoRoot) : null);
};

export { brockPinOf };
