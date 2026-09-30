/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { renderScreensFiles } from './render-screens.mjs';

/**
 * @param {string} rootDir
 * @returns {boolean} true when .brock/screens.ts changed
 */
const writeScreensFile = (rootDir) => {
  const [file] = renderScreensFiles(rootDir);
  if (!file) return false;
  const target = join(rootDir, file.path);
  if (existsSync(target) && readFileSync(target, 'utf8').replace(/\r\n/g, '\n') === file.content) return false;
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, file.content, 'utf8');
  return true;
};

export { writeScreensFile };
