/* @layer tooling-scripts @kind logic */
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const RESTORE_MODULE = '@drizztdourden08/brock-build/restore-shared-build';

/**
 * @param {string} appDir an Electron app folder
 * @returns {Promise<((rootDir: string, options: { log: (line: string) => void }) => unknown) | null>} the app's restore, null on an older brock-build
 */
const sharedBuildRestorer = async (appDir) => {
  try {
    const file = createRequire(join(appDir, 'package.json')).resolve(RESTORE_MODULE);
    return (await import(pathToFileURL(file).href)).restoreSharedBuild ?? null;
  } catch {
    return null;
  }
};

export { sharedBuildRestorer };
