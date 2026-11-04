/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { pushVerb } from '../src/pr/push.mjs';
import { initRepo, run } from './git-fixture.mjs';

const workspace = { base: 'main', protectedBranches: ['main'], worktreesDir: '.worktrees' };

let root = '';
let main = '';
let origin = '';
let other = '';
let savedHome;
let savedCwd = '';
const lines = [];

const commit = (dir, file) => {
  writeFileSync(join(dir, file), file);
  run(dir, 'add', '.');
  run(dir, 'commit', '-q', '-m', `add ${file}`);
};

const runPush = (positional = []) => pushVerb.run(positional, {}, { workspace, log: (line) => lines.push(line) });

beforeEach(() => {
  savedCwd = process.cwd();
  savedHome = process.env.COORD_HOME;
  root = mkdtempSync(join(tmpdir(), 'brock-pushbase-'));
  process.env.COORD_HOME = root;
  writeFileSync(join(root, 'remote.json'), JSON.stringify({ schema: 1, mode: 'remote' }));
  origin = join(root, 'origin.git');
  main = join(root, 'main');
  other = join(root, 'other');
  mkdirSync(main);
  writeFileSync(join(main, 'a.txt'), 'a');
  initRepo(main);
  run(root, 'init', '-q', '--bare', '-b', 'main', origin);
  run(main, 'remote', 'add', 'origin', origin);
  run(main, 'push', '-q', '-u', 'origin', 'main');
  lines.length = 0;
});

afterEach(() => {
  process.chdir(savedCwd);
  if (savedHome === undefined) delete process.env.COORD_HOME;
  else process.env.COORD_HOME = savedHome;
  rmSync(root, { recursive: true, force: true });
});

describe('K1 pr push of the base branch', { tags: ['critical'] }, () => {
  it('fast-forwards from the main checkout and states the range', async () => {
    commit(main, 'b.txt');
    const before = run(main, 'rev-parse', '--short', 'origin/main');
    process.chdir(main);
    await runPush();
    expect(lines.join('\n')).toContain(`1 commit(s) ${before}..${run(main, 'rev-parse', '--short', 'HEAD')}`);
    expect(lines.join('\n')).toContain('add b.txt');
    expect(run(origin, 'rev-parse', 'main')).toBe(run(main, 'rev-parse', 'HEAD'));
  });

  it('refuses a diverged base and sends nothing', async () => {
    run(root, 'clone', '-q', origin, other);
    run(other, 'config', 'user.name', 't');
    run(other, 'config', 'user.email', 't@t');
    commit(other, 'c.txt');
    run(other, 'push', '-q', 'origin', 'main');
    commit(main, 'd.txt');
    const remoteHead = run(origin, 'rev-parse', 'main');
    process.chdir(main);
    await expect(runPush()).rejects.toThrow(/diverged.*1 commit\(s\) here, 1 on origin\/main/);
    expect(run(origin, 'rev-parse', 'main')).toBe(remoteHead);
  });

  it('still refuses a base branch checked out inside a worktree', async () => {
    run(main, 'checkout', '-q', '-b', 'dev');
    const tree = join(root, 'tree');
    run(main, 'worktree', 'add', '-q', tree, 'main');
    process.chdir(tree);
    await expect(runPush()).rejects.toThrow(/base branch/);
  });
});
