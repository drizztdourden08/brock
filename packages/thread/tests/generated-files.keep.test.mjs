/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GENERATED_UNTRACKED } from '../src/worktree/generated-files.constants.mjs';
import { guards } from '../src/worktree/guards.mjs';

const run = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

const [INSTRUCTIONS] = GENERATED_UNTRACKED;

let root = '';

const write = (name, text = 'x\n') => {
  if (name.endsWith('/')) {
    mkdirSync(join(root, name), { recursive: true });
    writeFileSync(join(root, name, 'data'), text);
    return;
  }
  writeFileSync(join(root, name), text);
};

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'brock-generated-'));
  run(root, 'init', '-q');
  run(root, 'config', 'user.name', 't');
  run(root, 'config', 'user.email', 't@t');
  write('tracked.txt');
  run(root, 'add', '.');
  run(root, 'commit', '-q', '-m', 'init');
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

describe('assertClean with generated files', () => {
  it('accepts a fresh worktree holding only the generated untracked files', () => {
    for (const name of GENERATED_UNTRACKED) write(name);
    expect(() => guards.assertClean(root, 'refresh')).not.toThrow();
  });

  it('refuses another untracked file and still names it', () => {
    write(INSTRUCTIONS);
    write('notes.txt');
    expect(() => guards.assertClean(root, 'refresh')).toThrow(/notes\.txt/);
  });

  it('refuses a tracked instructions file that was modified', () => {
    write(INSTRUCTIONS, 'one\n');
    run(root, 'add', INSTRUCTIONS);
    run(root, 'commit', '-q', '-m', 'track');
    write(INSTRUCTIONS, 'two\n');
    expect(() => guards.assertClean(root, 'refresh')).toThrow(/Refusing to refresh/);
  });

  it('refuses a tracked file with changes next to generated files', () => {
    write('.mcp.json');
    write('tracked.txt', 'changed\n');
    expect(() => guards.assertClean(root, 'refresh')).toThrow(/tracked\.txt/);
  });
});
