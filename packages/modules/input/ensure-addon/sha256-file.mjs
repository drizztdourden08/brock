/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/**
 * @param {string} file
 * @returns {string} hex digest
 */
const sha256File = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');

export { sha256File };
