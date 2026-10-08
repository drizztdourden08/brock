/* @layer tooling-scripts @kind logic */
import { relative, isAbsolute } from 'node:path';

const holds = (dir, cwd) => {
  const rel = relative(dir, cwd);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
};

/**
 * @param {Record<string, { appDir?: (worktree: { path: string }) => string }>} targets
 * @param {string} rootDir the checkout the targets resolve from
 * @param {string} cwd the folder the command runs in
 * @returns {string | null} the target whose app folder holds cwd, deepest first
 */
const targetForCwd = (targets, rootDir, cwd) => {
  const found = Object.entries(targets)
    .flatMap(([key, target]) => (target.appDir ? [{ key, dir: target.appDir({ path: rootDir }) }] : []))
    .filter(({ dir }) => holds(dir, cwd))
    .sort((a, b) => b.dir.length - a.dir.length);
  return found[0]?.key ?? null;
};

export { targetForCwd };
