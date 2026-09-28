/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { basename, resolve } from 'node:path';
import { git, remoteBranch, tryGit } from '../git.mjs';

const USER_DATA_LINE = '?? .user-data/';

const assertNotProtected = (worktreePath, main) => {
  if (resolve(worktreePath) === resolve(main)) throw new Error('Refusing to remove the main checkout.');
};

const assertNotInside = (worktreePath, alias) => {
  if (resolve(worktreePath) !== resolve(process.cwd())) return;
  throw new Error(`Refusing to remove the worktree this session is running in. Use \`${alias} worktree finish\` instead, which handles it, or cd elsewhere and re-run: ${alias} worktree remove ${basename(worktreePath)}`);
};

const assertClean = (worktreePath, verb = 'remove') => {
  const porcelain = git(['status', '--porcelain'], worktreePath);
  if (!porcelain) return;
  const lines = porcelain.split('\n').filter((line) => line.trim() !== USER_DATA_LINE);
  if (lines.length === 0) return;
  throw new Error(`Refusing to ${verb}: uncommitted changes in ${worktreePath}:\n${lines.slice(0, 10).join('\n')}`);
};

const assertPushed = ({ worktreePath, branch, base, alias }) => {
  const upstream = remoteBranch(branch, worktreePath) ?? `origin/${base}`;
  const unpushed = Number(git(['rev-list', '--count', `${upstream}..HEAD`], worktreePath));
  if (unpushed === 0) return;
  throw new Error(`${unpushed} commit(s) on "${branch}" are not on ${upstream}. Run \`${alias} pr push\` first, or push the branch yourself.`);
};

const assertNoStash = (worktreePath, name) => {
  const stashes = tryGit(['stash', 'list'], worktreePath) ?? '';
  const matching = stashes.split('\n').filter((line) => line.includes(name));
  if (matching.length === 0) return;
  throw new Error(`Stash entries reference "${name}" and would be orphaned:\n${matching.join('\n')}`);
};

const runningInstancePids = (name) => {
  const script = `Get-CimInstance Win32_Process -Filter "Name='electron.exe'" | Where-Object { $_.CommandLine -like '*--instance=${name}*' } | Select-Object -ExpandProperty ProcessId`;
  try {
    return execFileSync('powershell', ['-NoProfile', '-Command', script], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
};

const assertNotRunning = (name) => {
  if (process.platform !== 'win32') return;
  const pids = runningInstancePids(name);
  if (!pids) return;
  throw new Error(`The "${name}" instance is still running (PID ${pids.split('\n').join(', ')}). Close it first, then re-run.`);
};

const guards = Object.freeze({ assertClean, assertNoStash, assertNotInside, assertNotProtected, assertNotRunning, assertPushed });

export { guards };
