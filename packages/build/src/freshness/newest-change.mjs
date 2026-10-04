/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} path a file or a folder
 * @returns {number} latest mtime inside the path, 0 when missing
 */
const newestChange = (path) => {
  if (!existsSync(path)) return 0;
  const stat = statSync(path);
  if (!stat.isDirectory()) return stat.mtimeMs;
  const inside = readdirSync(path).map((name) => newestChange(join(path, name)));
  return Math.max(stat.mtimeMs, ...inside);
};

export { newestChange };
