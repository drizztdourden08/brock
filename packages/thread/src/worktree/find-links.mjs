/* @layer tooling-scripts @kind logic */
import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const SKIP_DIRS = new Set(['.git', 'node_modules']);

const findLinks = (dir, base = dir, found = []) => {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isSymbolicLink()) {
      found.push(relative(base, full));
      continue;
    }
    if (SKIP_DIRS.has(entry.name)) continue;
    if (entry.isDirectory()) findLinks(full, base, found);
  }
  return found;
};

export { findLinks };
