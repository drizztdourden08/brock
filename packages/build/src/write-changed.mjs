/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

/**
 * @param {string} rootDir the app root
 * @param {{ path: string, content: string }[]} files generated files, paths relative to the root
 * @returns {string[]} the paths whose content changed and were written
 */
const writeChanged = (rootDir, files) => files.flatMap(({ path, content }) => {
  const target = join(rootDir, path);
  if (existsSync(target) && readFileSync(target, 'utf8').replace(/\r\n/g, '\n') === content) return [];
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, 'utf8');
  return [path];
});

export { writeChanged };
