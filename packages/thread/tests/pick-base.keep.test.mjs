/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { pickBase } from '../src/worktree/pick-base.mjs';

const run = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

const commit = (cwd, name) => {
  writeFileSync(join(cwd, `${name}.txt`), name);
  run(cwd, 'add', '.');
  run(cwd, '-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', name);
};

let dir = '';
let origin = '';
let main = '';
const lines = [];
const log = (line) => lines.push(line);

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'pick-base-'));
  origin = join(dir, 'origin');
  main = join(dir, 'main');
  execFileSync('git', ['init', '-q', '-b', 'main', origin]);
  commit(origin, 'first');
  execFileSync('git', ['clone', '-q', origin, main]);
  lines.length = 0;
});

afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe('pickBase', () => {
  it('takes origin when the local branch is level with it or behind', () => {
    expect(pickBase({ main, branch: 'main', fetched: true, log })).toBe('origin/main');
    commit(origin, 'second');
    run(main, 'fetch', '-q', 'origin');
    expect(pickBase({ main, branch: 'main', fetched: true, log })).toBe('origin/main');
  });

  it('takes the local branch when it is ahead of origin, and says so', () => {
    commit(main, 'local');
    expect(pickBase({ main, branch: 'main', fetched: true, log })).toBe('main');
    expect(lines.join('\n')).toContain('1 commit(s) ahead of origin/main');
  });

  it('stops when the two have diverged', () => {
    commit(main, 'local');
    commit(origin, 'remote');
    run(main, 'fetch', '-q', 'origin');
    expect(() => pickBase({ main, branch: 'main', fetched: true, log })).toThrow(/diverged \(1 ahead, 1 behind\)/);
  });

  it('takes the local branch when nothing was fetched', () => {
    expect(pickBase({ main, branch: 'main', fetched: false, log })).toBe('main');
  });
});
