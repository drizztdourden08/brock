/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { findRoot } from '@drizztdourden08/standards';

const PREPROCESSOR_FILE = join('node_modules', '@drizztdourden08', 'brock-build', 'src', 'knip-brock-dependencies.mjs');

/**
 * @param {string} [rootDir] the consumer root, default found from here
 * @returns {string[]} the preprocessor path, or none
 */
const brockKnipPreprocessors = (rootDir = findRoot()) => {
  for (let dir = rootDir; ; dir = dirname(dir)) {
    const file = join(dir, PREPROCESSOR_FILE);
    if (existsSync(file)) return [file];
    if (dirname(dir) === dir) return [];
  }
};

export { brockKnipPreprocessors };
