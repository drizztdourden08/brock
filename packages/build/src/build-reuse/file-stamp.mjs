/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const CRLF = /\r\n/g;

/**
 * @param {string} file a text file
 * @returns {string | null} a short hash of its text read with LF line ends, so a git checkout with CRLF keys the same; null when missing
 */
const contentOf = (file) => {
  try {
    return createHash('sha256').update(readFileSync(file, 'utf8').replace(CRLF, '\n')).digest('hex').slice(0, 24);
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

const hashed = new Map();

/**
 * @param {string} file
 * @returns {string | null} a SHA-1 of its bytes, null when missing
 */
const contentStampOf = (file) => {
  const stat = statSync(file, { throwIfNoEntry: false });
  if (!stat) return null;
  const at = `${file}|${stat.mtimeMs}|${stat.size}`;
  if (!hashed.has(at)) {
    try {
      hashed.set(at, `c:${createHash('sha1').update(readFileSync(file)).digest('hex')}`);
    } catch {
      return null;
    }
  }
  return hashed.get(at);
};

/**
 * @param {string} dir
 * @returns {string | null} a hash of the names in it, null when missing
 */
const listingStampOf = (dir) => {
  try {
    return `l:${createHash('sha1').update(readdirSync(dir).sort().join('/')).digest('hex')}`;
  } catch {
    return null;
  }
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

export { contentOf, contentStampOf, listingStampOf, stampOf, treeStamp };
