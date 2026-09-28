/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { SOURCE_EXTENSIONS } from './addon.constants.mjs';

/**
 * @param {string} nativeDir
 * @returns {number} newest mtime of the C++ sources and CMakeLists.txt
 */
const newestSourceTime = (nativeDir) => {
  const srcDir = join(nativeDir, 'src');
  const sources = existsSync(srcDir)
    ? readdirSync(srcDir, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile() && SOURCE_EXTENSIONS.includes(extname(entry.name)))
      .map((entry) => statSync(join(entry.parentPath, entry.name)).mtimeMs)
    : [];
  const cmake = join(nativeDir, 'CMakeLists.txt');
  return Math.max(0, ...sources, existsSync(cmake) ? statSync(cmake).mtimeMs : 0);
};

export { newestSourceTime };
