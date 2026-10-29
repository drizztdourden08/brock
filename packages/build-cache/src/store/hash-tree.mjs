/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SKIPPED_FOLDERS } from './store.constants.mjs';

/**
 * @param {string} dir
 * @param {Set<string>} [skip] folder names left out at any depth
 * @returns {string[]} every file under dir, relative, with forward slashes, sorted
 */
const filesOf = (dir, skip = SKIPPED_FOLDERS) => {
  const found = [];
  const visit = (rel) => {
    for (const entry of readdirSync(join(dir, rel), { withFileTypes: true })) {
      const path = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (!skip.has(entry.name)) visit(path);
      } else if (entry.isFile()) found.push(path);
    }
  };
  visit('');
  return found.sort();
};

/**
 * @param {string} dir
 * @param {Set<string>} [skip] folder names left out at any depth
 * @returns {{ contentHash: string, sizeBytes: number, fileCount: number }} a hash of every relative path and file content
 */
const hashTree = (dir, skip = SKIPPED_FOLDERS) => {
  const hash = createHash('sha256');
  let sizeBytes = 0;
  const files = filesOf(dir, skip);
  for (const rel of files) {
    const content = readFileSync(join(dir, rel));
    sizeBytes += content.length;
    hash.update(`${rel}\0${content.length}\0`).update(content);
  }
  return { contentHash: hash.digest('hex'), sizeBytes, fileCount: files.length };
};

/**
 * @param {unknown} value any JSON value
 * @returns {string} a short stable hash of it, keys sorted
 */
const hashValue = (value) => {
  const sorted = (item) => {
    if (Array.isArray(item)) return item.map(sorted);
    if (item && typeof item === 'object') return Object.fromEntries(Object.keys(item).sort().map((key) => [key, sorted(item[key])]));
    return item;
  };
  return createHash('sha256').update(JSON.stringify(sorted(value))).digest('hex').slice(0, 16);
};

export { hashTree, hashValue };
