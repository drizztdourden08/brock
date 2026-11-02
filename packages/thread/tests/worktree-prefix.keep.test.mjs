/* @layer tooling-scripts @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { defineWorkspace } from '../src/workspace/define-workspace.mjs';
import { baseVerb } from '../src/worktree/base.mjs';
import { commitVerb } from '../src/worktree/commit.mjs';
import { createVerb } from '../src/worktree/create.mjs';
import { finishVerb } from '../src/worktree/finish.mjs';
import { refreshVerb } from '../src/worktree/refresh.mjs';
import { removeVerb } from '../src/worktree/remove.mjs';

vi.mock('../src/gh.mjs', () => ({
  tryGh: () => '[]',
  ghLoud: () => {},
}));

process.env.COORD_HOME = mkdtempSync(join(tmpdir(), 'brock-remote-'));
writeFileSync(join(process.env.COORD_HOME, 'remote.json'), '{"mode":"remote"}');

const ENV = 'BROCK_WORKTREE_PREFIX';
const WHO = { GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' };

const run = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: 'pipe' }).trim();

const commit = (cwd, name) => {
  writeFileSync(join(cwd, `${name}.txt`), name);
  run(cwd, 'add', '--all');
  run(cwd, 'commit', '--quiet', '--message', name);
};

let home = '';
let dir = '';
let main = '';
let envBefore;
const lines = [];

const wt = (name) => join(main, '.worktrees', name);
const contextFor = (config) => ({ rootDir: main, workspace: defineWorkspace({ name: 'demo', base: 'main', ...config }), provision: [], targets: {}, log: (line) => lines.push(line) });
const create = (ctx, name, options = {}) => createVerb.run([name], { 'skip-install': true, ...options }, ctx);
const branchesOf = () => run(main, 'for-each-ref', '--format=%(refname:short)', 'refs/heads/agent/').split(/\r?\n/).filter(Boolean);

beforeEach(() => {
  home = process.cwd();
  envBefore = process.env[ENV];
  delete process.env[ENV];
  Object.assign(process.env, WHO);
  dir = mkdtempSync(join(tmpdir(), 'worktree-prefix-'));
  const seed = join(dir, 'seed');
  const origin = join(dir, 'origin.git');
  main = join(dir, 'main');
  execFileSync('git', ['init', '-q', '-b', 'main', seed]);
  commit(seed, 'first');
  execFileSync('git', ['clone', '-q', '--bare', seed, origin]);
  execFileSync('git', ['clone', '-q', origin, main]);
  process.chdir(main);
  lines.length = 0;
});

afterEach(() => {
  process.chdir(home);
  for (const key of Object.keys(WHO)) delete process.env[key];
  if (envBefore === undefined) delete process.env[ENV];
  else process.env[ENV] = envBefore;
  rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
});

describe('E2 worktree create with a prefix', { tags: ['e2e'] }, () => {
  it('uses the prefix from the workspace config for the folder and the branch', async () => {
    await create(contextFor({ worktrees: { prefix: 'web' } }), 'feat');
    expect(existsSync(wt('web-feat'))).toBe(true);
    expect(existsSync(wt('feat'))).toBe(false);
    expect(branchesOf()).toEqual(['agent/web-feat']);
    expect(lines).toContain('"web-feat" is ready.');
  });

  it('uses BROCK_WORKTREE_PREFIX, which wins over the workspace config', async () => {
    process.env[ENV] = 'env';
    await create(contextFor({ worktrees: { prefix: 'web' } }), 'feat');
    expect(existsSync(wt('env-feat'))).toBe(true);
    expect(branchesOf()).toEqual(['agent/env-feat']);
  });

  it('uses --prefix, which wins over the env var and the workspace config', async () => {
    process.env[ENV] = 'env';
    await create(contextFor({ worktrees: { prefix: 'web' } }), 'feat', { prefix: 'flag' });
    expect(existsSync(wt('flag-feat'))).toBe(true);
    expect(branchesOf()).toEqual(['agent/flag-feat']);
  });

  it('refuses a prefix with other characters, and a flag with no value', async () => {
    const ctx = contextFor({});
    await expect(create(ctx, 'feat', { prefix: 'we b' })).rejects.toThrow('not a valid worktree prefix');
    await expect(create(ctx, 'feat', { prefix: 'web_' })).rejects.toThrow('not a valid worktree prefix');
    await expect(create(ctx, 'feat', { prefix: true })).rejects.toThrow('--prefix needs a value');
    expect(() => contextFor({ worktrees: { prefix: '-x' } })).toThrow('worktrees.prefix');
    expect(existsSync(wt('feat'))).toBe(false);
  });

});

describe('E2 the other worktree verbs on a prefixed worktree', { tags: ['e2e'] }, () => {
  let ctx = null;

  beforeEach(async () => {
    ctx = contextFor({ worktrees: { prefix: 'web' } });
    await create(ctx, 'feat');
  });

  it('refresh, base and commit take the name with or without the prefix', async () => {
    await refreshVerb.run(['feat'], {}, ctx);
    await refreshVerb.run(['web-feat'], {}, ctx);
    expect(lines).toContain('"web-feat" refreshed.');
    await baseVerb.run(['feat'], {}, ctx);
    expect(lines.at(-1)).toBe('"web-feat" (agent/web-feat) is based on main: the workspace base, nothing stored.');
    await baseVerb.run(['web-feat'], {}, ctx);
    writeFileSync(join(wt('web-feat'), 'work.txt'), 'work');
    await commitVerb.run(['web-feat'], { message: 'feat: add the work file' }, ctx);
    expect(run(wt('web-feat'), 'log', '-1', '--format=%s')).toBe('feat: add the work file');
    writeFileSync(join(wt('web-feat'), 'more.txt'), 'more');
    await commitVerb.run(['feat'], { message: 'feat: add the more file' }, ctx);
    expect(run(wt('web-feat'), 'log', '-1', '--format=%s')).toBe('feat: add the more file');
  });

  it('finish takes the bare name and remove takes the full name', async () => {
    await create(ctx, 'two');
    await finishVerb.run(['feat'], {}, ctx);
    expect(existsSync(wt('web-feat'))).toBe(false);
    await removeVerb.run(['web-two'], {}, ctx);
    expect(existsSync(wt('web-two'))).toBe(false);
  });

});
