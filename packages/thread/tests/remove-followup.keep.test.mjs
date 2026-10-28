/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { isPathArgument, removeLeftover } from '../src/worktree/remove-leftover.mjs';
import { removeTree } from '../src/worktree/remove-tree.mjs';
import { isUpgradeThrowaway } from '../src/worktree/upgrade-throwaway.mjs';

const run = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

const workspace = { branchPrefix: 'agent/', worktreesDir: '.worktrees', base: 'main' };

let base = '';
let main = '';
let outside = '';
const lines = [];
const log = (message) => lines.push(message);
const ctx = () => ({ rootDir: main, workspace, log });

const commitOn = (branch, subject) => {
  run(main, 'checkout', '-q', '-B', branch, 'main');
  writeFileSync(join(main, `${branch.replace(/\W/g, '-')}.txt`), 'x\n');
  run(main, 'add', '.');
  run(main, 'commit', '-q', '-m', subject);
  run(main, 'checkout', '-q', 'main');
};

beforeEach(() => {
  base = mkdtempSync(join(tmpdir(), 'brock-remove-followup-'));
  main = join(base, 'main');
  outside = join(base, 'outside');
  lines.length = 0;
  mkdirSync(main);
  mkdirSync(outside);
  writeFileSync(join(outside, 'keep.txt'), 'keep\n');
  run(main, 'init', '-q', '-b', 'main');
  run(main, 'config', 'user.name', 't');
  run(main, 'config', 'user.email', 't@t');
  writeFileSync(join(main, 'file.txt'), 'x\n');
  run(main, 'add', '.');
  run(main, 'commit', '-q', '-m', 'init');
});

afterEach(() => rmSync(base, { recursive: true, force: true }));

describe('removeTree messages', () => {
  it('prints one plain line, not git\'s error, when its own delete handles it', async () => {
    const folder = join(base, 'not-a-worktree');
    mkdirSync(folder);
    writeFileSync(join(folder, 'a.txt'), 'a\n');
    expect(await removeTree(folder, main, log)).toBe(true);
    expect(lines).toEqual(['Git could not remove the folder in one pass, so Brock deleted it directly.']);
  });
});

describe('isUpgradeThrowaway', () => {
  const check = (branch) => isUpgradeThrowaway({ branch, base: 'main', cwd: main, workspace });

  it('accepts an upgrade branch with only upgrade commits, or none', () => {
    commitOn('agent/brock-0-113-0', 'Upgrade Brock to 0.113.0');
    run(main, 'branch', 'agent/brock-0-114-0', 'main');
    expect(check('agent/brock-0-113-0')).toBe(true);
    expect(check('agent/brock-0-114-0')).toBe(true);
  });

  it('accepts the workspace worktree prefix', () => {
    commitOn('agent/web-brock-0-113-0-beta-1', 'Upgrade Brock to 0.113.0-beta.1');
    expect(check('agent/web-brock-0-113-0-beta-1')).toBe(true);
  });

  it('refuses an upgrade-named branch that carries someone else\'s commit', () => {
    commitOn('agent/brock-0-113-0', 'Upgrade Brock to 0.113.0');
    run(main, 'checkout', '-q', 'agent/brock-0-113-0');
    writeFileSync(join(main, 'mine.txt'), 'mine\n');
    run(main, 'add', '.');
    run(main, 'commit', '-q', '-m', 'My own work');
    run(main, 'checkout', '-q', 'main');
    expect(check('agent/brock-0-113-0')).toBe(false);
  });

  it('refuses a branch that does not follow the upgrade name', () => {
    commitOn('agent/fix-menu', 'Upgrade Brock to 0.113.0');
    commitOn('agent/brock-notes', 'Upgrade Brock to 0.113.0');
    expect(check('agent/fix-menu')).toBe(false);
    expect(check('agent/brock-notes')).toBe(false);
  });
});

describe('removeLeftover', () => {
  const leftover = (name = 'brock-0-113-0') => {
    const dir = join(main, '.worktrees', name);
    let deep = join(dir, 'node_modules', '.pnpm');
    while (deep.length < 330) deep = join(deep, 'a-folder-with-a-long-name');
    mkdirSync(deep, { recursive: true });
    writeFileSync(join(deep, 'deep.txt'), 'deep\n');
    symlinkSync(outside, join(dir, 'node_modules', 'linked'), 'junction');
    return dir;
  };

  it('recognises a path argument and not a name', () => {
    expect(isPathArgument('.worktrees/brock-0-113-0')).toBe(true);
    expect(isPathArgument(join(main, 'x'))).toBe(true);
    expect(isPathArgument('brock-0-113-0')).toBe(false);
  });

  it('deletes an unlisted folder with a long path and a link, leaving the link target', async () => {
    const dir = leftover();
    await removeLeftover(dir, ctx());
    expect(existsSync(dir)).toBe(false);
    expect(existsSync(join(outside, 'keep.txt'))).toBe(true);
  });

  it('refuses a folder outside the worktrees folder', async () => {
    await expect(removeLeftover(outside, ctx())).rejects.toThrow(/not inside the worktrees folder/);
    await expect(removeLeftover(join(main, '.worktrees'), ctx())).rejects.toThrow(/not inside the worktrees folder/);
    expect(existsSync(join(outside, 'keep.txt'))).toBe(true);
  });

  it('refuses a folder git still lists', async () => {
    const dir = join(main, '.worktrees', 'listed');
    run(main, 'worktree', 'add', '-q', '-b', 'agent/listed', dir);
    await expect(removeLeftover(dir, ctx())).rejects.toThrow(/registered worktree/);
    expect(existsSync(dir)).toBe(true);
  });

  it('refuses a folder that does not exist', async () => {
    mkdirSync(join(main, '.worktrees'));
    await expect(removeLeftover(join(main, '.worktrees', 'nope'), ctx())).rejects.toThrow(/No folder/);
  });
});
