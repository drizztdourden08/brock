/* @layer tooling-scripts @kind logic */
import { remoteBranch, tryGit } from '../git.mjs';

const hasLocal = (main, branch) => tryGit(['rev-parse', '--verify', '--quiet', `refs/heads/${branch}`], main) !== null;

const aheadBehind = (main, branch, remote) => {
  const counts = tryGit(['rev-list', '--left-right', '--count', `${branch}...${remote}`], main);
  const [ahead, behind] = (counts ?? '0 0').split(/\s+/).map(Number);
  return { ahead, behind };
};

/**
 * @param {{ main: string, branch: string, fetched: boolean, log: (message: string) => void }} request
 * @returns {string} the ref a new worktree starts from
 */
const pickBase = ({ main, branch, fetched, log }) => {
  const remote = fetched ? remoteBranch(branch, main) : null;
  if (!remote) return branch;
  if (!hasLocal(main, branch)) return remote;
  const { ahead, behind } = aheadBehind(main, branch, remote);
  if (ahead > 0 && behind > 0) {
    throw new Error(`Local ${branch} and ${remote} have diverged (${ahead} ahead, ${behind} behind). Merge or rebase ${branch} first, or pass --from <ref>.`);
  }
  if (ahead === 0) return remote;
  log(`Local ${branch} is ${ahead} commit(s) ahead of ${remote}; basing the worktree on ${branch}.`);
  return branch;
};

export { pickBase };
