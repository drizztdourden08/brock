/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { findRoot } from '@drizztdourden08/standards';

const BUILD_MANIFEST = '@drizztdourden08/brock-build/package.json';
const PREPROCESSOR_FILE = join('src', 'knip-brock-dependencies.mjs');

/**
 * @param {string} [rootDir] the consumer root, default found from here
 * @returns {string[]} the preprocessor path, or none
 */
const brockKnipPreprocessors = (rootDir = findRoot()) => {
  try {
    const manifest = createRequire(join(rootDir, 'package.json')).resolve(BUILD_MANIFEST);
    const file = join(dirname(manifest), PREPROCESSOR_FILE);
    return existsSync(file) ? [file] : [];
  } catch {
    return [];
  }
};

export { brockKnipPreprocessors };
