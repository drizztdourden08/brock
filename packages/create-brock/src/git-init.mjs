/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';

const git = (cwd, args) => spawnSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

const identityArgs = (cwd, { authorName, authorEmail }) => {
  const name = git(cwd, ['config', 'user.name']).stdout.trim();
  const email = git(cwd, ['config', 'user.email']).stdout.trim();
  return [
    ...(name ? [] : ['-c', `user.name=${authorName || 'Brock'}`]),
    ...(email ? [] : ['-c', `user.email=${authorEmail || 'brock@localhost'}`]),
  ];
};

/**
 * @param {string} targetDir
 * @param {import('./identity.mjs').Identity} identity
 * @returns {string | null} outcome, or null inside a repo
 */
const initRepository = (targetDir, identity) => {
  if (git(targetDir, ['rev-parse', '--is-inside-work-tree']).stdout.trim() === 'true') return null;
  if (git(targetDir, ['init', '-b', 'main']).status !== 0) return 'git init failed; the thread commands need a repository';
  git(targetDir, ['add', '-A']);
  const commit = git(targetDir, [...identityArgs(targetDir, identity), 'commit', '-q', '-m', `Scaffold ${identity.name} with create-brock`]);
  return commit.status === 0 ? 'initialised a git repository on main with the first commit' : 'initialised a git repository; the first commit failed';
};

export { initRepository };
