/* @layer tooling-scripts @kind logic */
import { git, pushBranch, remoteBranch, tryGit } from '../git.mjs';
import { deferredNote, isLocalMode } from '../local/remote-mode.mjs';
import { prBranch } from './branch.mjs';
import { pushStatement } from './push-statement.mjs';

const refuseDiverged = (path, branch, upstream) => {
  const [behind, ahead] = git(['rev-list', '--left-right', '--count', `${upstream}...HEAD`], path).split(/\s+/);
  throw new Error(`"${branch}" has diverged from ${upstream}: ${ahead} commit(s) here, ${behind} on ${upstream}. Merge or rebase ${upstream} into it first. A base push is fast-forward only and never forced.`);
};

/**
 * @param {{ path: string, branch: string }} target
 * @param {{ log: (line: string) => void }} ctx
 * @returns {void}
 */
const pushBase = ({ path, branch }, { log }) => {
  prBranch.warnIfDirty(path, log);
  const local = isLocalMode();
  if (!local) git(['fetch', 'origin', branch], path);
  const upstream = remoteBranch(branch, path);
  if (upstream && tryGit(['merge-base', '--is-ancestor', upstream, 'HEAD'], path) === null) refuseDiverged(path, branch, upstream);
  if (upstream && prBranch.unpushedCount(path, branch).count === 0) {
    log(`"${branch}" is already up to date on ${upstream}. Nothing to push.`);
    return;
  }
  for (const line of pushStatement(path, branch, upstream)) log(line);
  if (local) {
    log(`Would push "${branch}" to origin.`);
    log(deferredNote('the push'));
    return;
  }
  pushBranch(branch, path);
  log(`"${branch}" pushed from the main checkout.`);
};

export { pushBase };
