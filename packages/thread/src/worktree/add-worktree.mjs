/* @layer tooling-scripts @kind logic */
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { gitLoud, tryGit } from '../git.mjs';
import { pickBase } from './pick-base.mjs';
import { resumeBranch } from './resume-branch.mjs';
import { excludeWorktrees } from './exclude-worktrees.mjs';
import { threadBase } from './thread-base.mjs';

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
 * @param {{ name: string, path: string, from: string | null, base: string | null, ctx: import('../workspace/workspace.type.mjs').ThreadContext }} request
 * @returns {'cut' | 'resumed'}
 */
const addWorktree = ({ name, path, from, base, ctx }) => {
  const { rootDir: main, workspace, log } = ctx;
  const branch = `${workspace.branchPrefix}${name}`;
  mkdirSync(dirname(path), { recursive: true });
  if (excludeWorktrees(main, workspace.worktreesDir)) log(`Added /${workspace.worktreesDir}/ to .git/info/exclude.`);
  const fetched = fetchOrigin(main, log);
  if (base) threadBase.assertBase(base, main);
  if (resumeBranch({ main, path, branch, from, log })) return 'resumed';
  const start = from ?? pickBase({ main, branch: base ?? workspace.base, fetched, log });
  log(`Adding worktree at ${path} on ${branch} from ${start}.`);
  gitLoud(['worktree', 'add', '--no-track', '-b', branch, path, start], main);
  return 'cut';
};

export { addWorktree };
