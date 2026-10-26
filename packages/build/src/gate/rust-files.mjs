/* @layer tooling-scripts @kind logic */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { RUST_SKIP_DIRS, RUST_SOURCE } from './cargo.constants.mjs';

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  if (entry.name.startsWith('.') || RUST_SKIP_DIRS.has(entry.name)) return [];
  const path = join(dir, entry.name);
  if (entry.isDirectory()) return walk(path);
  return RUST_SOURCE.test(entry.name) ? [path] : [];
});

/**
 * @param {string} root the cargo root
 * @returns {string[]} the .rs files, not in target or dot-folders
 */
const rustFiles = (root) => walk(root).sort();

export { rustFiles };
