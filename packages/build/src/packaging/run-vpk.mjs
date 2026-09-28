/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { runInherit } from '../run.mjs';
import { VPK_INSTALL_HINT } from './packaging.constants.mjs';

const vpkCommand = () => {
  const local = join(homedir(), '.dotnet', 'tools', process.platform === 'win32' ? 'vpk.exe' : 'vpk');
  return existsSync(local) ? local : 'vpk';
};

/**
 * @param {string} rootDir
 * @param {string[]} args
 * @returns {Promise<number>}
 */
const runVpk = async (rootDir, args) => {
  try {
    return await runInherit(vpkCommand(), args, { cwd: rootDir });
  } catch (error) {
    if (error?.code === 'ENOENT') throw new Error(`vpk is not installed. Run: ${VPK_INSTALL_HINT}`, { cause: error });
    throw error;
  }
};

export { runVpk };
