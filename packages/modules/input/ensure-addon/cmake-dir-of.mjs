/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { CMAKE_DIR_ENV, CMAKE_DIR_FOLDER, CMAKE_DIR_TEMP } from './addon.constants.mjs';

/**
 * @param {string} packageDir the brock-input package folder
 * @param {Record<string, string | undefined>} env
 * @returns {string | null} the build folder, or null for in-package
 */
const cmakeDirOf = (packageDir, env) => {
  const wanted = env[CMAKE_DIR_ENV]?.trim();
  if (!wanted) return null;
  const base = wanted === CMAKE_DIR_TEMP ? join(tmpdir(), CMAKE_DIR_FOLDER) : resolve(wanted);
  return join(base, createHash('sha256').update(resolve(packageDir)).digest('hex').slice(0, 8));
};

export { cmakeDirOf };
