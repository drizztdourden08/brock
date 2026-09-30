/* @layer tooling-scripts @kind logic */
import { runInherit } from '../run.mjs';
import { VPK_INSTALL_HINT } from './packaging.constants.mjs';
import { vpkCommand } from './vpk-command.mjs';

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
