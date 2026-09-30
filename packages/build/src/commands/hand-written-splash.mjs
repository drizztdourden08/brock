/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { appDirs } from './app-dirs.mjs';

const HAND_WRITTEN = /id=["']boot-splash["']|src=["']\.\/logos\//;

/**
 * @param {string} rootDir
 * @returns {string[]} app pages that carry their own boot splash or logo paths
 */
const handWrittenSplash = (rootDir) => appDirs(rootDir)
  .map((dir) => join(dir, 'src', 'index.html'))
  .filter((page) => existsSync(join(rootDir, page)) && HAND_WRITTEN.test(readFileSync(join(rootDir, page), 'utf8')));

export { handWrittenSplash };
