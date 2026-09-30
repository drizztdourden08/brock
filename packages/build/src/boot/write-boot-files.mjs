/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { renderBootFiles } from './render-boot-files.mjs';

/**
 * @param {string} rootDir  The app root
 * @returns {string[]}  The registries rewritten this run
 */
const writeBootFiles = (rootDir) => renderBootFiles(rootDir).flatMap(({ path, content }) => {
  const target = join(rootDir, path);
  if (existsSync(target) && readFileSync(target, 'utf8').replace(/\r\n/g, '\n') === content) return [];
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, 'utf8');
  return [path];
});

export { writeBootFiles };
