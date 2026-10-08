/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

/**
 * @param {string} rootDir the app root
 * @param {{ path: string, content: string | null }[]} files null content removes the file
 * @returns {string[]} the paths written or removed
 */
const writeChanged = (rootDir, files) => files.flatMap(({ path, content }) => {
  const target = join(rootDir, path);
  if (content === null) {
    if (!existsSync(target)) return [];
    rmSync(target);
    return [path];
  }
  if (existsSync(target) && readFileSync(target, 'utf8').replace(/\r\n/g, '\n') === content) return [];
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, 'utf8');
  return [path];
});

export { writeChanged };
