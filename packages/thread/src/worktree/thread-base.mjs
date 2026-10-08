/* @layer tooling-scripts @kind logic */
import { git, remoteBranch, tryGit } from '../git.mjs';
import { tryGh } from '../gh.mjs';

const BASE_KEY = 'brockBase';
const BASE_KEYS = /^branch\..+\.brockbase$/i;

const configKey = (branch) => `branch.${branch}.${BASE_KEY}`;

const branchName = (ref) => ref.replace(/^refs\/heads\//, '').replace(/^(?:refs\/remotes\/)?origin\//, '');

const storedBase = (branch, cwd) => tryGit(['config', '--get', configKey(branch)], cwd) || null;

/**
 * @param {string} branch the worktree's branch
 * @param {string} cwd any checkout of the repo
 * @param {import('../workspace/workspace.type.mjs').Workspace} workspace
 * @returns {{ base: string, stored: boolean }} the stored base, else the workspace base
 */
const baseOf = (branch, cwd, workspace) => {
  const stored = branch && branch !== 'HEAD' ? storedBase(branch, cwd) : null;
  return stored ? { base: stored, stored: true } : { base: workspace.base, stored: false };
};

const branchExists = (base, cwd) =>
  remoteBranch(base, cwd) !== null || tryGit(['rev-parse', '--verify', '--quiet', `refs/heads/${base}`], cwd) !== null;

/**
 * @param {string} ref a branch, `origin/<branch>` or a full ref
 * @param {string} cwd
 * @returns {string} the branch name, when it exists here or on origin
 */
const assertBase = (ref, cwd) => {
  const base = branchName(ref);
  if (!base || !branchExists(base, cwd)) throw new Error(`"${ref}" is not a branch here or on origin, so it cannot be a base.`);
  return base;
};

/**
 * @param {{ branch: string, base: string, cwd: string, workspace: import('../workspace/workspace.type.mjs').Workspace }} request
 * @returns {void} the workspace base clears the entry
 */
const storeBase = ({ branch, base, cwd, workspace }) => {
  if (base === branch) throw new Error(`"${branch}" cannot be its own base.`);
  if (base === workspace.base) {
    tryGit(['config', '--unset', configKey(branch)], cwd);
    return;
  }
  git(['config', configKey(branch), base], cwd);
};

/**
 * @param {string | null} from the `--from` of a create
 * @param {string} cwd
 * @returns {string | null} the branch `from` names when origin has it
 */
const remoteBranchOf = (from, cwd) => {
  if (!from) return null;
  const name = branchName(from);
  return remoteBranch(name, cwd) ? name : null;
};

/**
 * @param {string} branch
 * @param {string} cwd
 * @returns {string | null} the base of the branch's open pull request
 */
const openPrBase = (branch, cwd) => {
  const out = tryGh(['pr', 'list', '--head', branch, '--state', 'open', '--json', 'baseRefName', '--limit', '1'], cwd);
  try {
    return JSON.parse(out ?? '[]')[0]?.baseRefName ?? null;
  } catch {
    return null;
  }
};

/**
 * @param {string} cwd
 * @returns {string[]} every branch some branch names as its base
 */
const basesInUse = (cwd) => (tryGit(['config', '--get-regexp', BASE_KEYS.source], cwd) ?? '')
  .split('\n')
  .map((line) => line.split(' ').slice(1).join(' ').trim())
  .filter(Boolean);

const threadBase = Object.freeze({ assertBase, baseOf, basesInUse, branchName, configKey, openPrBase, remoteBranchOf, storeBase, storedBase });

export { threadBase };
