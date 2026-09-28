/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} installDir
 * @returns {string | null} the folder holding SDL3Config.cmake
 */
const sdl3ConfigDir = (installDir) =>
  [join(installDir, 'cmake'), join(installDir, 'lib', 'cmake', 'SDL3'), join(installDir, 'lib64', 'cmake', 'SDL3')]
    .find((dir) => existsSync(join(dir, 'SDL3Config.cmake'))) ?? null;

export { sdl3ConfigDir };
