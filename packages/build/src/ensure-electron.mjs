/* @layer tooling-scripts @kind build */
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const TAG = '[brock ensure-electron]';

const readJson = (file) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
};

const readText = (file) => {
  try {
    return readFileSync(file, 'utf8').trim();
  } catch {
    return null;
  }
};

/**
 * @param {string} rootDir
 */
const locatePackage = (rootDir) => {
  const require = createRequire(join(rootDir, 'package.json'));
  try {
    return dirname(require.resolve('electron/package.json'));
  } catch {
    return join(rootDir, 'node_modules', 'electron');
  }
};

/**
 * @param {string} packageDir
 */
const binaryPath = (packageDir) => {
  const require = createRequire(join(packageDir, 'package.json'));
  try {
    const resolved = require(join(packageDir, 'index.js'));
    return typeof resolved === 'string' ? resolved : null;
  } catch {
    return null;
  }
};

const brokenReason = (rootDir, packageDir) => {
  const shimVersion = readJson(join(packageDir, 'package.json'))?.version;
  if (!shimVersion) {
    return existsSync(packageDir) ? 'the electron package is incomplete (no package.json)' : 'the electron package is not installed';
  }
  if (!existsSync(join(packageDir, 'install.js'))) return 'the electron package is incomplete (no install.js)';
  const binary = binaryPath(packageDir);
  if (!binary || !existsSync(binary)) return 'the electron binary is missing';
  const distVersion = readText(join(packageDir, 'dist', 'version'))?.replace(/^v/, '');
  if (distVersion !== shimVersion) return `the extracted binary (v${distVersion ?? '?'}) does not match the electron package (v${shimVersion})`;
  return null;
};

/**
 * @param {string} packageDir
 * @returns {boolean} whether install.js ran and exited 0
 */
const runInstallScript = (packageDir) => {
  const script = join(packageDir, 'install.js');
  if (!existsSync(script)) return false;
  try {
    execSync(`"${process.execPath}" "${script}"`, { cwd: packageDir, stdio: 'inherit' });
    return true;
  } catch {
    return false;
  }
};

/**
 * @returns {string | null} an error message, or null when the reinstall ran
 */
const reinstallPackage = (rootDir, packageDir) => {
  console.log(`${TAG} Reinstalling electron from the lockfile (this downloads about 100 MB)...`);
  try {
    rmSync(packageDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {
    return 'Could not clear node_modules/electron. A file in it is in use. Close any instance of the app running from this tree, then retry.';
  }
  try {
    execSync('pnpm install --force', { cwd: rootDir, stdio: 'inherit', shell: true });
  } catch {
    return '`pnpm install --force` failed. See the output above (offline? registry unreachable?).';
  }
  return null;
};

/**
 * @param {string} rootDir
 * @returns {{ ok: boolean, message: string}}
 */
const ensureElectron = (rootDir) => {
  const packageDir = locatePackage(rootDir);
  const reason = brokenReason(rootDir, packageDir);
  if (!reason) return { ok: true, message: 'Electron binary is ready.' };

  console.log(`${TAG} ${reason}. Repairing...`);
  runInstallScript(packageDir);
  if (brokenReason(rootDir, packageDir)) {
    const failure = reinstallPackage(rootDir, packageDir);
    if (failure) return { ok: false, message: failure };
    runInstallScript(packageDir);
  }
  const remaining = brokenReason(rootDir, packageDir);
  if (remaining) return { ok: false, message: `Repair finished but ${remaining}. Delete node_modules and run pnpm install.` };
  return { ok: true, message: 'Electron binary is ready.' };
};

export { ensureElectron, brokenReason };
