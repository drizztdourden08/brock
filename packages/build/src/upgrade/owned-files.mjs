/* @layer tooling-scripts @kind logic */
import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { renderLaunchers } from '../launcher/render-launchers.mjs';
import { MANAGED_FILES } from '../managed/templates.mjs';
import { NOT_OWNED_DIRS } from './upgrade.constants.mjs';

const walk = (rootDir, dir, out) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && !NOT_OWNED_DIRS.has(entry.name)) walk(rootDir, join(dir, entry.name), out);
    else if (entry.isFile()) out.push(relative(rootDir, join(dir, entry.name)).replace(/\\/g, '/'));
  }
  return out;
};

/**
 * @param {string} rootDir the app folder
 * @returns {string[]} root-relative paths sync never writes
 */
const ownedFiles = (rootDir) => {
  const managed = new Set([...MANAGED_FILES.map(({ target }) => target), ...renderLaunchers(rootDir).map(({ path }) => path)]);
  return walk(rootDir, rootDir, []).filter((file) => !managed.has(file)).sort();
};

export { ownedFiles };
