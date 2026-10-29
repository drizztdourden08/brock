/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CLONE_LOCK_REASON, lockClone, lockReasonOf } from '../src/worktree/clone-lock.mjs';
import { deleteTree } from '../src/worktree/delete-tree.mjs';
import { removeTree } from '../src/worktree/remove-tree.mjs';

const run = (cwd, ...args) => String(execFileSync('git', args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] })).trim();

let base = '';
let main = '';
let worktree = '';
const lines = [];
const log = (line) => lines.push(line);

beforeEach(() => {
  base = mkdtempSync(join(tmpdir(), 'brock-clone-lock-'));
  main = join(base, 'main');
  worktree = join(base, 'tree');
  lines.length = 0;
  mkdirSync(join(main, 'packages', 'engine'), { recursive: true });
  writeFileSync(join(main, 'packages', 'engine', 'index.js'), 'export {};\n');
  writeFileSync(join(main, '.gitignore'), 'node_modules/\n');
  run(main, 'init', '-q', '-b', 'main');
  run(main, 'config', 'user.name', 't');
  run(main, 'config', 'user.email', 't@t');
  run(main, 'add', '.');
  run(main, 'commit', '-q', '-m', 'init');
  run(main, 'worktree', 'add', '-q', '--detach', worktree, 'HEAD');
});

afterEach(async () => {
  await deleteTree({ owner: main, target: join(main, '.git'), mains: [] });
  await deleteTree({ owner: tmpdir(), target: base, mains: [] });
});

describe('the clone lock', () => {
  it('is placed on a cloned worktree and lifted by removeTree after the links are gone, leaving what they pointed at', async () => {
    const shared = join(base, 'store', 'dep');
    mkdirSync(shared, { recursive: true });
    writeFileSync(join(shared, 'package.json'), '{}');
    mkdirSync(join(worktree, 'node_modules'), { recursive: true });
    symlinkSync(shared, join(worktree, 'node_modules', 'dep'), 'junction');
    expect(lockClone(worktree, main, log)).toBe(true);
    expect(lockReasonOf(worktree, main)).toBe(CLONE_LOCK_REASON);
    expect(() => run(main, 'worktree', 'remove', worktree)).toThrow();
    expect(existsSync(join(shared, 'package.json'))).toBe(true);
    expect(await removeTree(worktree, main, log, base)).toBe(true);
    expect(existsSync(worktree)).toBe(false);
    expect(existsSync(join(shared, 'package.json'))).toBe(true);
    expect(lockReasonOf(worktree, main)).toBeNull();
  });
});
