/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { restoreElectron, storeElectron } from '@drizztdourden08/build-cache/electron';

const binaryOf = (requireFromApp) => {
  try {
    const resolved = requireFromApp('electron');
    return typeof resolved === 'string' && existsSync(resolved) ? resolved : null;
  } catch {
    return null;
  }
};

const packageDirOf = (requireFromApp) => {
  try {
    return dirname(requireFromApp.resolve('electron/package.json'));
  } catch {
    return null;
  }
};

/**
 * @param {string} packageDir the installed electron package
 * @param {(message: string) => void} log
 * @returns {void} copies a missing binary in from the build cache
 */
const restoreFromCache = (packageDir, log) => {
  if (restoreElectron(packageDir) === 'restored') log('The electron binary came from the build cache, no download.');
};

/**
 * @param {string} packageDir the installed electron package
 * @returns {void} stores this binary in the build cache, unawaited
 */
const keepInCache = (packageDir) => {
  storeElectron(packageDir).catch(() => {});
};

/**
 * @param {string} appDir
 * @param {(message: string) => void} log
 * @returns {string} the binary: cached, present or downloaded
 */
const ensureElectronBinary = (appDir, log) => {
  const requireFromApp = createRequire(join(appDir, 'package.json'));
  const packageDir = packageDirOf(requireFromApp);
  if (packageDir) restoreFromCache(packageDir, log);
  const found = binaryOf(requireFromApp);
  if (found) {
    if (packageDir) keepInCache(packageDir);
    return found;
  }
  if (!packageDir) throw new Error(`electron is not installed for ${appDir}. Run pnpm install.`);
  log('The electron binary is missing (its install script did not run). Downloading it now...');
  execFileSync(process.execPath, [join(packageDir, 'install.js')], { cwd: packageDir, stdio: 'inherit' });
  const installed = binaryOf(requireFromApp);
  if (!installed) throw new Error(`electron is still missing its binary after install.js ran in ${packageDir}. Delete node_modules and install again.`);
  keepInCache(packageDir);
  return installed;
};

export { ensureElectronBinary };
