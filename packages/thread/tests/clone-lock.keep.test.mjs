/* @layer tooling-scripts @kind test */
import { existsSync, mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CLONE_LOCK_REASON, lockClone, lockReasonOf } from '../src/worktree/clone-lock.mjs';
import { deleteTree } from '../src/worktree/delete-tree.mjs';
import { initRepo, run } from './git-fixture.mjs';
import { removeTree } from '../src/worktree/remove-tree.mjs';


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
  initRepo(main);
  run(main, 'worktree', 'add', '-q', '--detach', worktree, 'HEAD');
});

afterEach(async () => {
  await deleteTree({ owner: main, target: join(main, '.git'), mains: [] });
  await deleteTree({ owner: tmpdir(), target: base, mains: [] });
});

describe('K5 the clone lock', { tags: ['e2e'] }, () => {
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
