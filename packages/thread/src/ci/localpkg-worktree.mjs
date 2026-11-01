/* @layer tooling-scripts @kind logic */
import { localpkgCall } from '../replay/replay-localpkg.mjs';

const firstLine = (error) => String(error.message).split('\n')[0];

/**
 * @param {{ localpkg: { binary: object, exec: Function }, path: string }} input path is the temporary worktree
 * @returns {void}
 */
const useLocalpkg = ({ localpkg, path }) => {
  const { command, args } = localpkgCall(localpkg.binary, ['use', path, '--no-install', '--unmerged']);
  try {
    localpkg.exec(command, args, { cwd: path });
  } catch (error) {
    throw new Error(`localpkg could not prepare the temporary worktree ${path}: ${firstLine(error)}`);
  }
};

/**
 * @param {{ localpkg: { binary: object, exec: Function }, path: string, log: (message: string) => void }} input
 * @returns {void} a failure is logged, never thrown
 */
const releaseLocalpkg = ({ localpkg, path, log }) => {
  const { command, args } = localpkgCall(localpkg.binary, ['off', path, '--no-install']);
  try {
    localpkg.exec(command, args, { cwd: path });
  } catch (error) {
    log(`localpkg off failed for ${path}: ${firstLine(error)}`);
  }
};

export { releaseLocalpkg, useLocalpkg };
