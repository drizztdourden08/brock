/* @layer tooling-scripts @kind logic */
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { gitLoud, tryGit } from '../git.mjs';
import { resumeBranch } from './resume-branch.mjs';
import { excludeWorktrees } from './exclude-worktrees.mjs';

const hasOrigin = (main) => tryGit(['remote', 'get-url', 'origin'], main) !== null;

const fetchOrigin = (main, log) => {
  if (!hasOrigin(main)) {
    log('No origin remote; skipping the fetch.');
    return false;
  }
  log('Fetching origin.');
  gitLoud(['fetch', 'origin'], main);
  return true;
};

/**
 * @param {{ name: string, path: string, from: string | null, ctx: import('../workspace/workspace.type.mjs').ThreadContext }} request
 * @returns {void}
 */
const addWorktree = ({ name, path, from, ctx }) => {
  const { rootDir: main, workspace, log } = ctx;
  const branch = `${workspace.branchPrefix}${name}`;
  mkdirSync(dirname(path), { recursive: true });
  if (excludeWorktrees(main, workspace.worktreesDir)) log(`Added /${workspace.worktreesDir}/ to .git/info/exclude.`);
  const fetched = fetchOrigin(main, log);
  if (resumeBranch({ main, path, branch, from, log })) return;
  const base = from ?? (fetched ? `origin/${workspace.base}` : workspace.base);
  log(`Adding worktree at ${path} on ${branch} from ${base}.`);
  gitLoud(['worktree', 'add', '--no-track', '-b', branch, path, base], main);
};

export { addWorktree };
