/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const binaryOf = (requireFromApp) => {
  try {
    const resolved = requireFromApp('electron');
    return typeof resolved === 'string' && existsSync(resolved) ? resolved : null;
  } catch {
    return null;
  }
};

/**
 * @param {string} appDir
 * @param {(message: string) => void} log
 * @returns {string} the electron binary, downloaded when missing
 */
const ensureElectronBinary = (appDir, log) => {
  const requireFromApp = createRequire(join(appDir, 'package.json'));
  const found = binaryOf(requireFromApp);
  if (found) return found;
  const packageDir = dirname(requireFromApp.resolve('electron/package.json'));
  log('The electron binary is missing (its install script did not run). Downloading it now...');
  execFileSync(process.execPath, [join(packageDir, 'install.js')], { cwd: packageDir, stdio: 'inherit' });
  const installed = binaryOf(requireFromApp);
  if (!installed) throw new Error(`electron is still missing its binary after install.js ran in ${packageDir}. Delete node_modules and install again.`);
  return installed;
};

export { ensureElectronBinary };
