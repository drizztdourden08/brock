/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative, sep } from 'node:path';

const insideSkipped = (dir, file, skip) => relative(dir, file).split(sep).slice(0, -1).some((part) => skip.has(part));

/**
 * @param {string} dir
 * @param {string[]} extensions
 * @param {string[]} [skipDirs] folder names never entered
 * @returns {number[]} the mtime of every matching file below dir
 */
const collectTimes = (dir, extensions, skipDirs = []) => {
  if (!existsSync(dir)) return [];
  const wanted = new Set(extensions.map((ext) => ext.toLowerCase()));
  const skip = new Set(skipDirs);
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && wanted.has(extname(entry.name).toLowerCase()))
    .map((entry) => join(entry.parentPath, entry.name))
    .filter((file) => !insideSkipped(dir, file, skip))
    .map((file) => statSync(file).mtimeMs);
};

export { collectTimes };
