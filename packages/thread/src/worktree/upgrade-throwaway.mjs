/* @layer tooling-scripts @kind logic */
import { remoteBranch, tryGit } from '../git.mjs';

const UPGRADE_BRANCH = /(?:^|-)brock-\d+-\d+-\d+(?:-[a-z0-9]+)*$/;
const UPGRADE_COMMIT = /^Upgrade Brock to /;

const commitSubjectsAhead = (branch, base, cwd) => {
  const out = tryGit(['log', '--format=%s', `${remoteBranch(base, cwd) ?? base}..${branch}`], cwd);
  return out === null ? null : out.split('\n').filter(Boolean);
};

/**
 * @param {{ branch: string, base: string, cwd: string, workspace: import('../workspace/workspace.type.mjs').Workspace }} request
 * @returns {boolean} true for an upgrade throwaway
 */
const isUpgradeThrowaway = ({ branch, base, cwd, workspace }) => {
  const name = branch.startsWith(workspace.branchPrefix) ? branch.slice(workspace.branchPrefix.length) : branch;
  if (!UPGRADE_BRANCH.test(name)) return false;
  const subjects = commitSubjectsAhead(branch, base, cwd);
  return subjects !== null && subjects.every((subject) => UPGRADE_COMMIT.test(subject));
};

export { isUpgradeThrowaway };
