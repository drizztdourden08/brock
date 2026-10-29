/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { isLocalMode } from './local/remote-mode.mjs';

const LONG_PATHS = Object.freeze(['-c', 'core.longpaths=true']);

const REMOTE_VERBS = new Set(['fetch', 'push', 'pull', 'ls-remote', 'clone']);

const gitVerb = (args) => {
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '-c') i += 1;
    else if (!args[i].startsWith('-')) return args[i];
  }
  return undefined;
};

const blockedInLocalMode = (args) => REMOTE_VERBS.has(gitVerb(args)) && isLocalMode();

const git = (args, cwd) => {
  if (blockedInLocalMode(args)) throw new Error(`git ${gitVerb(args)} is not run in local mode (~/.coord/remote.json).`);
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
};

const REPO_ENV = Object.freeze(['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR', 'GIT_OBJECT_DIRECTORY', 'GIT_PREFIX']);

/**
 * @returns {NodeJS.ProcessEnv} the environment, no variable names a repo
 */
const repoFreeEnv = () => Object.fromEntries(Object.entries(process.env).filter(([key]) => !REPO_ENV.includes(key.toUpperCase())));

/**
 * @param {string[]} args
 * @param {string} cwd the repository git answers for, never the env
 * @returns {string} the trimmed output
 */
const gitAt = (args, cwd) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: repoFreeEnv() }).trim();

/**
 * @param {string[]} args
 * @param {string} cwd
 * @returns {string | null} the trimmed output, null when git failed
 */
const tryGitAt = (args, cwd) => {
  try {
    return gitAt(args, cwd);
  } catch {
    return null;
  }
};

const tryGit = (args, cwd) => {
  try {
    return git(args, cwd);
  } catch {
    return null;
  }
};

const gitLoud = (args, cwd) => {
  if (blockedInLocalMode(args)) {
    console.log(`Local mode: skipped git ${gitVerb(args)} (the remote is used only on the owner's go).`);
    return;
  }
  execFileSync('git', args, { cwd, stdio: 'inherit' });
};

const remoteBranch = (branch, cwd) => {
  const ref = `origin/${branch}`;
  return tryGit(['rev-parse', '--verify', '--quiet', `refs/remotes/${ref}`], cwd) ? ref : null;
};

const pushBranch = (branch, cwd) => gitLoud(['push', '--set-upstream', 'origin', branch], cwd);

export { git, gitAt, gitLoud, LONG_PATHS, pushBranch, remoteBranch, tryGit, tryGitAt };
