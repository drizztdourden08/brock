/* @layer tooling-scripts @kind logic */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { NOT_OWNED_DIRS } from '../upgrade.constants.mjs';
import { SOURCE_FILE } from './design.constants.mjs';

const walk = (dir, out) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && !NOT_OWNED_DIRS.has(entry.name)) walk(join(dir, entry.name), out);
    else if (entry.isFile() && SOURCE_FILE.test(entry.name)) out.push(join(dir, entry.name));
  }
  return out;
};

/**
 * @param {string} repoRoot
 * @returns {string[]} every script and stylesheet, absolute
 */
const repoFiles = (repoRoot) => walk(repoRoot, []);

export { repoFiles };
