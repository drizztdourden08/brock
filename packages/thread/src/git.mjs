/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';

const git = (args, cwd) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

const tryGit = (args, cwd) => {
  try {
    return git(args, cwd);
  } catch {
    return null;
  }
};

const gitLoud = (args, cwd) => {
  execFileSync('git', args, { cwd, stdio: 'inherit' });
};

const remoteBranch = (branch, cwd) => {
  const ref = `origin/${branch}`;
  return tryGit(['rev-parse', '--verify', '--quiet', `refs/remotes/${ref}`], cwd) ? ref : null;
};

const pushBranch = (branch, cwd) => gitLoud(['push', '--set-upstream', 'origin', branch], cwd);

export { git, gitLoud, pushBranch, remoteBranch, tryGit };
