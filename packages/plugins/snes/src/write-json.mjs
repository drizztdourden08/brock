/* @layer tooling-scripts @kind logic */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

/**
 * @param {string} path
 * @param {unknown} data
 * @returns {void}
 */
const writeJson = (path, data) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
};

export { writeJson };
