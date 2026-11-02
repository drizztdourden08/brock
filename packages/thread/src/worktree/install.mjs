/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { flag } from '../cli/thread-args.mjs';
import { tryGit } from '../git.mjs';
import { NO_PURGE_PROMPT } from '../pnpm.constants.mjs';
import { cloneInstall } from './clone/clone-install.mjs';

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
  try {
    execFileSync('pnpm', [...args, NO_PURGE_PROMPT], { cwd: dir, stdio: 'inherit', shell: process.platform === 'win32' });
  } catch (error) {
    throw new Error(`pnpm ${args.join(' ')} failed in ${dir} (${error?.status ?? error?.message ?? 'no exit code'}); its output is above. The install is unfinished, so fix the cause and run it again.`, { cause: error });
  }
  if (args.includes('--fix-lockfile')) restoreLockfile(dir, log);
};

const appDirsOf = (worktree, targets) =>
  Object.values(targets).map((target) => target.appDir?.(worktree)).filter((dir) => dir && dir !== worktree.path);

const cloneFirst = (worktree, options, ctx) => {
  if (flag(options, 'no-clone') || !installable(worktree.path)) return Promise.resolve(null);
  return cloneInstall({ target: worktree.path, main: ctx.rootDir, log: ctx.log });
};

/**
 * @param {import('../workspace/workspace.type.mjs').WorktreeContext} worktree
 * @param {Record<string, string | boolean>} options --skip-install leaves node_modules alone
 * @param {import('../workspace/workspace.type.mjs').ThreadContext} ctx
 * @returns {Promise<{ source: string, store: string } | null>} the checkout node_modules came from
 */
const installDependencies = async (worktree, options, ctx) => {
  if (flag(options, 'skip-install')) {
    ctx.log('--skip-install: leaving node_modules as it is.');
    return null;
  }
  const dirs = [...new Set([worktree.path, ...appDirsOf(worktree, ctx.targets)])];
  if (!dirs.some(installable)) {
    ctx.log('Nothing to install: no package.json without node_modules at the root or in a target app.');
    return null;
  }
  const cloned = await cloneFirst(worktree, options, ctx);
  for (const dir of dirs) {
    if (installable(dir)) installIn(dir, ctx.log);
  }
  return cloned;
};

export { installDependencies };
