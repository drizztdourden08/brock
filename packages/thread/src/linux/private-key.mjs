/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

/**
 * @param {string} distro
 * @param {string} linuxPath an absolute path inside the distro
 * @returns {string} the same file through the WSL share
 */
const wslUncPath = (distro, linuxPath) => `\\\\wsl.localhost\\${distro}${linuxPath.replace(/\//g, '\\')}`;

const isWindowsPath = (path) => /^[A-Za-z]:[\\/]/.test(path) || path.startsWith('\\\\');

const restrictToUser = (file) => {
  const user = process.env.USERNAME ?? '';
  execFileSync('icacls', [file, '/inheritance:r'], { stdio: 'ignore' });
  execFileSync('icacls', [file, '/grant:r', `${user}:F`], { stdio: 'ignore' });
};

/**
 * @param {{ identityFile: string | null, wslDistro: string }} machine
 * @returns {string | null} a copy only this user reads
 */
const privateKeyPath = (machine) => {
  const { identityFile } = machine;
  if (!identityFile) return null;
  if (process.platform !== 'win32') return identityFile;
  const source = isWindowsPath(identityFile) ? identityFile : wslUncPath(machine.wslDistro, identityFile);
  const copy = join(mkdtempSync(join(tmpdir(), 'brock-linux-')), 'id');
  copyFileSync(source, copy);
  restrictToUser(copy);
  return copy;
};

/**
 * @param {{ identityFile: string | null }} machine
 * @param {string | null} key what privateKeyPath returned
 */
const disposeKey = (machine, key) => {
  if (key && key !== machine.identityFile) rmSync(dirname(key), { recursive: true, force: true });
};

export { privateKeyPath, disposeKey, wslUncPath };
