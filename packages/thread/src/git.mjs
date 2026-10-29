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

export { git, gitLoud, LONG_PATHS, pushBranch, remoteBranch, tryGit };
