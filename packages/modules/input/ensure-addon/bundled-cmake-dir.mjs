/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const CMAKE_TAIL = join('Common7', 'IDE', 'CommonExtensions', 'Microsoft', 'CMake', 'CMake', 'bin');

const childDirs = (dir) => (existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => join(dir, e.name)) : []);

/**
 * @returns {string | null} the cmake bin folder of a Visual Studio install
 */
const bundledCmakeDir = () => {
  if (process.platform !== 'win32') return null;
  const roots = [process.env['ProgramFiles(x86)'], process.env.ProgramFiles].filter(Boolean);
  return roots
    .flatMap((root) => childDirs(join(root, 'Microsoft Visual Studio')))
    .flatMap((year) => childDirs(year))
    .map((edition) => join(edition, CMAKE_TAIL))
    .find((bin) => existsSync(join(bin, 'cmake.exe'))) ?? null;
};

export { bundledCmakeDir };
