/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tryGitAt } from '../git.mjs';
import { localpkgCall } from '../replay/replay-localpkg.mjs';

const firstLine = (error) => String(error.message).split('\n')[0];

const sharedExclude = (path) => {
  const common = tryGitAt(['rev-parse', '--git-common-dir'], path);
  return common ? join(resolve(path, common), 'info', 'exclude') : null;
};

const readText = (file) => (file && existsSync(file) ? readFileSync(file, 'utf8') : null);

/**
 * @param {{ localpkg: { binary: object, exec: Function }, path: string }} input path is the temporary worktree
 * @returns {void}
 */
const useLocalpkg = ({ localpkg, path }) => {
  const { command, args } = localpkgCall(localpkg.binary, ['use', path, '--no-install', '--unmerged']);
  try {
    localpkg.exec(command, args, { cwd: path });
  } catch (error) {
    throw new Error(`localpkg could not prepare the temporary worktree ${path}: ${firstLine(error)}`, { cause: error });
  }
};

/**
 * @param {{ localpkg: { binary: object, exec: Function }, path: string, log: (message: string) => void }} input
 * @returns {void} a failure is logged, never thrown
 */
const releaseLocalpkg = ({ localpkg, path, log }) => {
  const exclude = sharedExclude(path);
  const before = readText(exclude);
  const { command, args } = localpkgCall(localpkg.binary, ['off', path, '--no-install']);
  try {
    localpkg.exec(command, args, { cwd: path });
  } catch (error) {
    log(`localpkg off failed for ${path}: ${firstLine(error)}`);
  }
  if (before !== null && readText(exclude) !== before) writeFileSync(exclude, before);
};

export { releaseLocalpkg, useLocalpkg };
