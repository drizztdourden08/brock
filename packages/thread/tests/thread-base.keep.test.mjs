/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineWorkspace } from '../src/workspace/define-workspace.mjs';
import { createVerb } from '../src/worktree/create.mjs';
import { refreshVerb } from '../src/worktree/refresh.mjs';
import { finishVerb } from '../src/worktree/finish.mjs';
import { removeVerb } from '../src/worktree/remove.mjs';
import { baseVerb } from '../src/worktree/base.mjs';
import { deleteBranch } from '../src/worktree/delete-branch.mjs';
import { openVerb } from '../src/pr/open.mjs';
import { statusVerb } from '../src/pr/status.mjs';

const gh = vi.hoisted(() => ({ calls: [], replies: {} }));

vi.mock('../src/gh.mjs', () => ({
  tryGh: (args) => gh.replies[args.slice(0, 2).join(' ')] ?? '[]',
  ghLoud: (args) => gh.calls.push(args),
}));

const GM = 'agent/grand-merge';

const run = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

const tryRun = (cwd, ...args) => {
  try {
    return run(cwd, ...args);
  } catch {
    return null;
  }
};

const identity = (cwd) => {
  run(cwd, 'config', 'user.name', 't');
  run(cwd, 'config', 'user.email', 't@t');
};

const commit = (cwd, name) => {
  writeFileSync(join(cwd, `${name}.txt`), name);
  run(cwd, 'add', '.');
  run(cwd, 'commit', '-q', '-m', name);
};

const isAncestor = (cwd, ref, of) => tryRun(cwd, 'merge-base', '--is-ancestor', ref, of) !== null;

let home = '';
let dir = '';
let main = '';
let other = '';
let ctx = null;
const lines = [];

const wt = (name) => join(main, '.worktrees', name);
const create = (name, options = {}) => createVerb.run([name], { 'skip-install': true, ...options }, ctx);
const storedBase = (branch) => tryRun(main, 'config', '--get', `branch.${branch}.brockBase`);

const advance = (branch, name) => {
  run(other, 'fetch', '-q', 'origin');
  run(other, 'checkout', '-q', '-B', branch, `origin/${branch}`);
  commit(other, name);
  run(other, 'push', '-q', 'origin', branch);
};

beforeEach(() => {
  home = process.cwd();
  dir = mkdtempSync(join(tmpdir(), 'thread-base-'));
  const seed = join(dir, 'seed');
  const origin = join(dir, 'origin.git');
  main = join(dir, 'main');
  other = join(dir, 'other');
  execFileSync('git', ['init', '-q', '-b', 'main', seed]);
  identity(seed);
  commit(seed, 'first');
  run(seed, 'branch', GM);
  execFileSync('git', ['clone', '-q', '--bare', seed, origin]);
  for (const clone of [main, other]) {
    execFileSync('git', ['clone', '-q', origin, clone]);
    identity(clone);
  }
  process.chdir(main);
  lines.length = 0;
  gh.calls.length = 0;
  gh.replies = {};
  ctx = { rootDir: main, workspace: defineWorkspace({ name: 'demo', base: 'main' }), provision: [], targets: {}, log: (line) => lines.push(line) };
});

afterEach(() => {
  process.chdir(home);
  rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
});

describe('a thread based on an integration branch', { timeout: 60_000 }, () => {
  it('takes the remote branch --from names as its base', async () => {
    advance(GM, 'gm-only');
    await create('feat', { from: `origin/${GM}` });
    expect(run(wt('feat'), 'rev-parse', 'HEAD')).toBe(run(main, 'rev-parse', `origin/${GM}`));
    expect(storedBase('agent/feat')).toBe(GM);
  });

  it('starts from --base when --from is left off, and --base wins over --from', async () => {
    advance(GM, 'gm-only');
    await create('feat', { base: GM });
    expect(run(wt('feat'), 'rev-parse', 'HEAD')).toBe(run(main, 'rev-parse', `origin/${GM}`));
    expect(storedBase('agent/feat')).toBe(GM);
    await create('back', { from: `origin/${GM}`, base: 'origin/main' });
    expect(storedBase('agent/back')).toBeNull();
    await expect(create('bad', { base: 'nope' })).rejects.toThrow('"nope" is not a branch here or on origin');
    expect(existsSync(wt('bad'))).toBe(false);
  });

  it('rebases on its base, not on the workspace base', async () => {
    await create('feat', { from: `origin/${GM}` });
    commit(wt('feat'), 'work');
    advance(GM, 'gm-next');
    advance('main', 'main-next');
    await refreshVerb.run(['feat'], { rebase: true }, ctx);
    expect(isAncestor(wt('feat'), `origin/${GM}`, 'HEAD')).toBe(true);
    expect(isAncestor(wt('feat'), 'origin/main', 'HEAD')).toBe(false);
  });

  it('opens its pull request into its base, and pr status says when the PR targets another', async () => {
    await create('feat', { from: `origin/${GM}` });
    commit(wt('feat'), 'work');
    await openVerb.run(['feat'], { title: 'Add the work file' }, ctx);
    const [args] = gh.calls;
    expect(args.slice(0, 2)).toEqual(['pr', 'create']);
    expect(args[args.indexOf('--base') + 1]).toBe(GM);
    gh.replies['pr view'] = JSON.stringify({ number: 7, title: 'Add the work file', url: 'u', state: 'OPEN', baseRefName: 'main' });
    await statusVerb.run(['feat'], {}, ctx);
    expect(lines).toContain(`  The thread's base is ${GM}, but this PR targets main.`);
  });
});

describe('retiring a thread based on an integration branch', { timeout: 60_000 }, () => {
  it('finish refuses until the work is on its base, then retires the thread', async () => {
    await create('feat', { from: `origin/${GM}` });
    commit(wt('feat'), 'work');
    await expect(finishVerb.run(['feat'], {}, ctx)).rejects.toThrow(`are not on origin/${GM}`);
    run(main, 'push', '-q', 'origin', `agent/feat:${GM}`);
    await finishVerb.run(['feat'], {}, ctx);
    expect(existsSync(wt('feat'))).toBe(false);
    expect(run(main, 'branch', '--list', 'agent/feat')).toBe('');
    expect(lines.join('\n')).toContain(`merged into origin/${GM}`);
  });

  it('remove deletes the branch, local and remote, once it is merged into its base', async () => {
    await create('feat', { base: GM });
    commit(wt('feat'), 'work');
    run(wt('feat'), 'push', '-q', '-u', 'origin', 'agent/feat');
    run(other, 'fetch', '-q', 'origin');
    run(other, 'checkout', '-q', '-B', GM, `origin/${GM}`);
    run(other, 'merge', '-q', '--no-ff', '-m', 'Merge feat', 'origin/agent/feat');
    run(other, 'push', '-q', 'origin', GM);
    await removeVerb.run(['feat'], {}, ctx);
    expect(existsSync(wt('feat'))).toBe(false);
    expect(run(main, 'branch', '--list', 'agent/feat')).toBe('');
    expect(run(main, 'ls-remote', '--heads', 'origin', 'agent/feat')).toBe('');
  });

  it('keeps a branch that another branch names as its base', async () => {
    await create('feat', { base: GM });
    deleteBranch({ branch: GM, cwd: main, via: 'merged', ctx });
    expect(lines).toContain(`Branch "${GM}" kept: another branch names it as its base.`);
    expect(run(main, 'ls-remote', '--heads', 'origin', GM)).not.toBe('');
  });

  it('takes the base of the open PR when it resumes a branch with none stored', async () => {
    run(main, 'push', '-q', 'origin', `origin/${GM}:refs/heads/agent/feat`);
    gh.replies['pr list'] = JSON.stringify([{ baseRefName: GM }]);
    await create('feat');
    expect(storedBase('agent/feat')).toBe(GM);
  });
});

describe('worktree base', { timeout: 60_000 }, () => {
  it('shows the base and changes it; the workspace base clears the entry', async () => {
    await create('feat');
    expect(lines).toContain('Base: main, the workspace base.');
    await baseVerb.run(['feat', `origin/${GM}`], {}, ctx);
    expect(storedBase('agent/feat')).toBe(GM);
    expect(lines.at(-1)).toBe(`"feat" (agent/feat) is based on ${GM}: stored in git config branch.agent/feat.brockBase.`);
    process.chdir(wt('feat'));
    await baseVerb.run(['main'], {}, ctx);
    expect(storedBase('agent/feat')).toBeNull();
    expect(lines.at(-1)).toBe('"feat" (agent/feat) is based on main: the workspace base, nothing stored.');
    await expect(baseVerb.run(['feat', 'nope'], {}, ctx)).rejects.toThrow('is not a branch');
    await expect(baseVerb.run(['feat', 'agent/feat'], {}, ctx)).rejects.toThrow('cannot be its own base');
  });

  it('falls back to the workspace base for a worktree made before bases', async () => {
    run(main, 'worktree', 'add', '-q', '--no-track', '-b', 'agent/old', wt('old'), 'origin/main');
    commit(wt('old'), 'work');
    advance('main', 'main-next');
    await baseVerb.run(['old'], {}, ctx);
    expect(lines.at(-1)).toBe('"old" (agent/old) is based on main: the workspace base, nothing stored.');
    await refreshVerb.run(['old'], { rebase: true }, ctx);
    expect(isAncestor(wt('old'), 'origin/main', 'HEAD')).toBe(true);
    run(wt('old'), 'push', '-q', 'origin', 'agent/old:main');
    await finishVerb.run(['old'], {}, ctx);
    expect(existsSync(wt('old'))).toBe(false);
    expect(lines.join('\n')).toContain('merged into origin/main');
  });
});
