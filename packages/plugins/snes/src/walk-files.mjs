/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} dir
 * @param {(file: string, name: string) => void} onFile
 * @param {Set<string>} [skip] directory names never entered
 * @returns {void}
 */
const walkFiles = (dir, onFile, skip = new Set()) => {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, onFile, skip);
    else if (entry.isFile()) onFile(full, entry.name);
  }
};

export { walkFiles };
