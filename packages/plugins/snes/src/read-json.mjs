/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';

/**
 * @template T
 * @param {string} path
 * @param {T} fallback
 * @returns {T}
 */
const readJson = (path, fallback) => {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return fallback;
  }
};

export { readJson };
