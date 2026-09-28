/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';

/**
 * @param {string} file
 * @returns {any} the parsed file, or null when absent or unreadable
 */
const readJson = (file) => {
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
};

export { readJson };
