/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { flag } from '../cli/thread-args.mjs';
import { tryGit } from '../git.mjs';

const installable = (dir) => existsSync(join(dir, 'package.json')) && !existsSync(join(dir, 'node_modules'));

const DRIVE_LINK = /^\s*(?:specifier|version): link:[A-Za-z]:[\\/]/m;

const installArgs = (dir) => {
  const lockfile = join(dir, 'pnpm-lock.yaml');
  if (!existsSync(lockfile)) return ['install'];
  const linksToADrive = DRIVE_LINK.test(readFileSync(lockfile, 'utf8'));
  return linksToADrive ? ['install', '--fix-lockfile'] : ['install', '--frozen-lockfile'];
};

const restoreLockfile = (dir, log) => {
  const restored = tryGit(['checkout', '--', 'pnpm-lock.yaml'], dir);
  if (restored !== null) log('Lockfile restored: the fixed resolution lives in node_modules, the tree stays clean.');
};

const installIn = (dir, log) => {
  const args = installArgs(dir);
  log(`Running pnpm ${args.join(' ')} in ${dir}.`);
  execFileSync('pnpm', args, { cwd: dir, stdio: 'inherit', shell: process.platform === 'win32' });
  if (args.includes('--fix-lockfile')) restoreLockfile(dir, log);
};

const appDirsOf = (worktree, targets) =>
  Object.values(targets).map((target) => target.appDir?.(worktree)).filter((dir) => dir && dir !== worktree.path);

/**
 * @param {import('../workspace/workspace.type.mjs').WorktreeContext} worktree
 * @param {Record<string, string | boolean>} options
 * @param {import('../workspace/workspace.type.mjs').ThreadContext} ctx
 * @returns {void}
 */
const installDependencies = (worktree, options, ctx) => {
  if (flag(options, 'skip-install')) {
    ctx.log('--skip-install: leaving node_modules as it is.');
    return;
  }
  const dirs = [worktree.path, ...appDirsOf(worktree, ctx.targets)].filter(installable);
  if (dirs.length === 0) {
    ctx.log('Nothing to install: no package.json without node_modules at the root or in a target app.');
    return;
  }
  for (const dir of dirs) installIn(dir, ctx.log);
};

export { installDependencies };
