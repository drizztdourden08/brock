/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} file
 * @returns {string | null} a short hash of its bytes, null when missing
 */
const contentOf = (file) => {
  try {
    return createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 24);
  } catch {
    return null;
  }
};

/**
 * @param {string} file
 * @returns {string | null} mtime and size, null when missing
 */
const stampOf = (file) => {
  const stat = statSync(file, { throwIfNoEntry: false });
  return stat ? `${stat.mtimeMs}:${stat.size}` : null;
};

/**
 * @param {string} dir
 * @returns {string} file count, newest mtime and total size
 */
const treeStamp = (dir) => {
  let count = 0;
  let newest = 0;
  let size = 0;
  const visit = (path) => {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const full = join(path, entry.name);
      if (entry.isDirectory()) visit(full);
      else {
        const stat = statSync(full, { throwIfNoEntry: false });
        if (!stat) continue;
        count += 1;
        newest = Math.max(newest, stat.mtimeMs);
        size += stat.size;
      }
    }
  };
  try {
    visit(dir);
  } catch {
    return 'missing';
  }
  return `${count}:${newest}:${size}`;
};

export { contentOf, stampOf, treeStamp };
