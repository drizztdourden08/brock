/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { renderScreensFiles } from './render-screens.mjs';

/** @param {string} rootDir @param {{ path: string, content: string }} file */
const writeIfChanged = (rootDir, file) => {
  const target = join(rootDir, file.path);
  if (existsSync(target) && readFileSync(target, 'utf8').replace(/\r\n/g, '\n') === file.content) return false;
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, file.content, 'utf8');
  return true;
};

/**
 * @param {string} rootDir
 * @returns {boolean} true when .brock/screens.ts or .brock/search.ts changed
 */
const writeScreensFile = (rootDir) => renderScreensFiles(rootDir).map((file) => writeIfChanged(rootDir, file)).includes(true);

export { writeScreensFile };
