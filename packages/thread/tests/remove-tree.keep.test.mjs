/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { deleteTree } from '../src/worktree/delete-tree.mjs';
import { removeTree } from '../src/worktree/remove-tree.mjs';

const run = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

let base = '';
let main = '';
let outside = '';
let tree = '';
const lines = [];
const log = (message) => lines.push(message);

const deepFolder = (start) => {
  let dir = start;
  while (dir.length < 330) dir = join(dir, 'a-folder-with-a-long-name');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'deep.txt'), 'deep\n');
  return dir;
};

beforeEach(() => {
  base = mkdtempSync(join(tmpdir(), 'brock-remove-tree-'));
  main = join(base, 'main');
  outside = join(base, 'outside');
  tree = join(base, 'wt');
  lines.length = 0;
  mkdirSync(main);
  mkdirSync(outside);
  writeFileSync(join(outside, 'keep.txt'), 'keep\n');
  run(main, 'init', '-q');
  run(main, 'config', 'user.name', 't');
  run(main, 'config', 'user.email', 't@t');
  writeFileSync(join(main, '.gitignore'), 'node_modules/\ndist/\n');
  writeFileSync(join(main, 'file.txt'), 'x\n');
  run(main, 'add', '.');
  run(main, 'commit', '-q', '-m', 'init');
  run(main, 'worktree', 'add', '-q', '-b', 'agent/wt', tree);
});

afterEach(() => rmSync(base, { recursive: true, force: true }));

describe('removeTree', () => {
  it('removes a worktree whose node_modules holds a path past 260 characters', async () => {
    const deep = deepFolder(join(tree, 'node_modules', '.pnpm', 'pkg@1.0.0', 'node_modules', 'pkg'));
    expect(deep.length).toBeGreaterThan(260);
    mkdirSync(join(tree, 'dist'));
    writeFileSync(join(tree, 'dist', 'out.js'), 'out\n');
    expect(await removeTree(tree, main, log)).toBe(true);
    expect(existsSync(tree)).toBe(false);
    expect(run(main, 'worktree', 'list')).not.toContain('wt');
  });

  it('removes a link inside node_modules without following it', async () => {
    mkdirSync(join(tree, 'node_modules'), { recursive: true });
    symlinkSync(outside, join(tree, 'node_modules', 'linked'), 'junction');
    expect(await removeTree(tree, main, log)).toBe(true);
    expect(existsSync(tree)).toBe(false);
    expect(readFileSync(join(outside, 'keep.txt'), 'utf8')).toBe('keep\n');
  });

  it('refuses a worktree with an uncommitted tracked change and deletes nothing', async () => {
    mkdirSync(join(tree, 'node_modules'));
    writeFileSync(join(tree, 'node_modules', 'x.js'), 'x\n');
    writeFileSync(join(tree, 'file.txt'), 'changed\n');
    await expect(removeTree(tree, main, log)).rejects.toThrow(/uncommitted changes/);
    expect(existsSync(join(tree, 'node_modules', 'x.js'))).toBe(true);
  });
});

describe('deleteTree', () => {
  it('removes a link target itself and leaves what it points to', async () => {
    symlinkSync(outside, join(tree, 'link'), 'junction');
    expect(await deleteTree(tree, join(tree, 'link'))).toBeNull();
    expect(existsSync(join(tree, 'link'))).toBe(false);
    expect(existsSync(join(outside, 'keep.txt'))).toBe(true);
  });

  it('refuses a path outside the worktree', async () => {
    await expect(deleteTree(tree, outside)).rejects.toThrow(/outside/);
    expect(existsSync(join(outside, 'keep.txt'))).toBe(true);
  });

  it('refuses a path that reaches outside through a link in its folder', async () => {
    symlinkSync(outside, join(tree, 'via'), 'junction');
    await expect(deleteTree(tree, join(tree, 'via', 'keep.txt'))).rejects.toThrow(/resolves outside/);
    expect(existsSync(join(outside, 'keep.txt'))).toBe(true);
  });

  it('treats a folder that is already gone as deleted', async () => {
    const result = await deleteTree(tree, join(tree, 'missing'));
    expect(result).toBeNull();
  });
});
