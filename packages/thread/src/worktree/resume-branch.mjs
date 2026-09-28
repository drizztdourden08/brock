/* @layer tooling-scripts @kind logic */
import { gitLoud, remoteBranch, tryGit } from '../git.mjs';

const localBranch = (branch, cwd) => Boolean(tryGit(['rev-parse', '--verify', '--quiet', `refs/heads/${branch}`], cwd));

const namesBranch = (from, branch) =>
  [branch, `origin/${branch}`, `refs/heads/${branch}`, `refs/remotes/origin/${branch}`].includes(from);

/**
 * @param {{ main: string, path: string, branch: string, from: string | null, log: (message: string) => void }} request
 * @returns {boolean} true when an existing branch was attached
 */
const resumeBranch = ({ main, path, branch, from, log }) => {
  const local = localBranch(branch, main);
  const remote = remoteBranch(branch, main);
  if (!local && !remote) return false;
  if (from !== null && !namesBranch(from, branch)) {
    throw new Error(`Branch "${branch}" already exists, so --from ${from} cannot cut it fresh. Resume it with --from ${branch} (or no --from), or pick another worktree name.`);
  }
  if (local) {
    log(`Branch ${branch} already exists; attaching the worktree to it at ${path}.`);
    gitLoud(['worktree', 'add', path, branch], main);
    return true;
  }
  log(`Branch ${branch} exists on origin only; checking it out at ${path}.`);
  gitLoud(['worktree', 'add', '--track', '-b', branch, path, remote], main);
  return true;
};

export { resumeBranch };
