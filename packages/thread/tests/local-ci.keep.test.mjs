/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { latestRunFor, newRunId, readRecords, writeRecord } from '../src/ci/check-record.mjs';
import { ciDir, recordFile } from '../src/ci/ci-paths.mjs';
import { ciWorktreesFolder } from '../src/ci/ci-worktree.mjs';
import { planSteps } from '../src/ci/ci-plan.mjs';
import { runCi } from '../src/ci/run-ci.mjs';
import { acquireRunLock } from '../src/ci/run-lock.mjs';
import { readWorkflow } from '../src/ci/workflow-jobs.mjs';
import { mergeBlocker } from '../src/pr/merge-gate.mjs';
import { mergeVerb } from '../src/pr/merge.mjs';

const WORKFLOW = `name: ci
jobs:
  gate:
    uses: owner/standards/.github/workflows/ci.yml@v0
    with:
      scripts: lint lint:md structure test
      sync-check: false

  upgrade:
    runs-on: windows-latest
    steps:
      - run: echo hi
`;

const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

let home = '';
let saved;
let savedProject;
let repo = '';
const lines = [];
const log = (message) => lines.push(message);

const workspace = { name: 'demo', base: 'main', protectedBranches: ['main'], worktreesDir: '.worktrees', publish: {}, gate: undefined };
const ctxOf = (extra = {}) => ({ rootDir: repo, workspace: { ...workspace, ...extra }, log });

const commitFile = (name, text) => {
  writeFileSync(join(repo, name), text);
  git(repo, 'add', '-A');
  git(repo, 'commit', '-q', '-m', `add ${name}`);
  return git(repo, 'rev-parse', 'HEAD');
};

beforeEach(() => {
  saved = process.env.COORD_HOME;
  savedProject = process.env.COORD_PROJECT;
  delete process.env.COORD_PROJECT;
  home = mkdtempSync(join(tmpdir(), 'brock-ci-home-'));
  process.env.COORD_HOME = home;
  repo = mkdtempSync(join(tmpdir(), 'brock-ci-repo-'));
  lines.length = 0;
  git(repo, 'init', '-q', '-b', 'main');
  git(repo, 'config', 'user.name', 't');
  git(repo, 'config', 'user.email', 't@t');
  commitFile('README.md', 'hello\n');
});

afterEach(() => {
  if (saved === undefined) delete process.env.COORD_HOME;
  else process.env.COORD_HOME = saved;
  if (savedProject === undefined) delete process.env.COORD_PROJECT;
  else process.env.COORD_PROJECT = savedProject;
  for (const dir of [home, repo, ciWorktreesFolder(repo)]) rmSync(dir, { recursive: true, force: true });
});

describe('check-run records', () => {
  it('sorts run ids by start time and writes a record whole, with no temp file left', () => {
    const early = newRunId(new Date('2026-10-29T10:00:00.000Z'));
    const late = newRunId(new Date('2026-10-29T10:00:00.001Z'));
    expect([late, early].sort()[0]).toBe(early);
    const file = recordFile('demo', early);
    writeRecord(file, { kind: 'check-run', id: early, commit: 'abc', status: 'queued', steps: [] });
    writeRecord(file, { kind: 'check-run', id: early, commit: 'abc', status: 'pass', steps: [] });
    expect(JSON.parse(readFileSync(file, 'utf8')).status).toBe('pass');
    expect(readdirSync(ciDir('demo'))).toEqual([`${early}.json`]);
    expect(latestRunFor('demo', 'abc').id).toBe(early);
    expect(latestRunFor('demo', 'other')).toBeNull();
  });

  it('ignores files that are not whole check-run records', () => {
    mkdirSync(ciDir('demo'), { recursive: true });
    writeFileSync(join(ciDir('demo'), 'broken.json'), '{ nope');
    writeFileSync(join(ciDir('demo'), 'x.json.123.tmp'), '{"kind":"check-run"}');
    expect(readRecords('demo')).toEqual([]);
  });
});

describe('the step plan', () => {
  it('reads the gate scripts from the workflow, installs first and plans the other jobs step by step', () => {
    const plan = planSteps({ workspace, workflowText: WORKFLOW });
    expect(plan.map((step) => step.name)).toEqual(['install', 'lint', 'lint:md', 'structure', 'test', 'upgrade / echo hi']);
    expect(plan[0].command).toBe('pnpm install --offline --frozen-lockfile');
    expect(plan[1].command).toBe('pnpm run lint');
    expect(plan.at(-1)).toMatchObject({ job: 'upgrade', command: 'echo hi', shell: 'pwsh' });
    expect(plan.map((step) => step.required)).toEqual([true, true, true, true, true, true]);
  });

  it('prefers gate.scripts of the workspace and honours requiredChecks', () => {
    const plan = planSteps({ workspace: { ...workspace, gate: { scripts: ['typecheck', 'test'] }, publish: { requiredChecks: ['test'] } }, workflowText: WORKFLOW, job: 'gate' });
    expect(plan.map((step) => [step.name, step.required])).toEqual([['install', true], ['typecheck', false], ['test', true]]);
  });

  it('falls back to brock gate, narrows to a job or to named steps, and refuses unknown names', () => {
    expect(planSteps({ workspace }).map((step) => step.command)).toEqual(['pnpm install --offline --frozen-lockfile', 'pnpm exec brock gate']);
    expect(planSteps({ workspace, workflowText: WORKFLOW, job: 'upgrade' }).map((step) => step.name)).toEqual(['upgrade / echo hi']);
    expect(planSteps({ workspace, workflowText: WORKFLOW, only: ['lint'] }).map((step) => step.name)).toEqual(['install', 'lint']);
    expect(() => planSteps({ workspace, workflowText: WORKFLOW, only: ['nope'] })).toThrow(/No step named "nope"/);
    expect(() => planSteps({ workspace, workflowText: WORKFLOW, job: 'nope' })).toThrow(/No job "nope"/);
  });

  it('reads jobs and unquotes a quoted scripts value', () => {
    expect(readWorkflow(WORKFLOW.replace('lint lint:md structure test', "'lint test'")).jobs.map((job) => job.scripts)).toEqual([['lint', 'test'], null]);
  });
});

describe('a run', () => {
  const plan = (...steps) => steps.map(([name, command, required = true]) => ({ name, command, job: 'gate', required }));
  const request = (steps, extra = {}) => ({ project: 'demo', sha: git(repo, 'rev-parse', 'HEAD'), branch: 'main', pr: 'PR-1', trigger: 'pr', plan: steps, partial: false, waitMs: 5000, ...extra });
  const node = (code, text) => `node -e "console.log('${text}'); process.exit(${code})"`;

  it('writes the record at start, after each step and at the end, then removes the temp worktree', async () => {
    const announced = [];
    const code = await runCi({ ctx: ctxOf(), runId: newRunId(), request: request(plan(['one', node(0, 'first line')], ['two', node(0, 'second')])), announce: (file) => announced.push(file) });
    expect(code).toBe(0);
    const record = JSON.parse(readFileSync(announced[0], 'utf8'));
    expect(record).toMatchObject({ kind: 'check-run', project: 'demo', pr: 'PR-1', trigger: 'pr', mode: 'local', status: 'pass', branch: 'main' });
    expect(record.commit).toBe(request([]).sha);
    expect(record.steps.map((step) => step.status)).toEqual(['pass', 'pass']);
    expect(record.steps[0]).toMatchObject({ name: 'one', required: true, exitCode: 0 });
    expect(record.steps[0].durationMs).toBeGreaterThanOrEqual(0);
    expect(readFileSync(record.steps[0].log, 'utf8')).toContain('first line');
    expect(record.runner.node).toBe(process.version);
    expect(record.finishedAt).toBeTruthy();
    expect(existsSync(join(repo, '.worktrees')) ? readdirSync(join(repo, '.worktrees')) : []).toEqual([]);
    expect(existsSync(join(ciDir('demo'), '.lock'))).toBe(false);
  });

  it('stops at the first failing step and records the rest as not run', async () => {
    const code = await runCi({ ctx: ctxOf(), runId: newRunId(), request: request(plan(['a', node(0, 'a')], ['b', node(3, 'boom')], ['c', node(0, 'c')])), announce: () => {} });
    expect(code).toBe(1);
    const record = readRecords('demo').at(-1);
    expect(record.status).toBe('fail');
    expect(record.steps.map((step) => step.status)).toEqual(['pass', 'fail', 'not-run']);
    expect(record.steps[1].exitCode).toBe(3);
    expect(record.summary).toMatch(/b failed \(exit 3\)/);
  });

  it('records a step that only exists elsewhere as skipped-local and keeps the run passing', async () => {
    const steps = [...plan(['ok', node(0, 'ok')]), { name: 'mac', command: '', job: 'mac', required: false, skip: 'macOS only' }];
    expect(await runCi({ ctx: ctxOf(), runId: newRunId(), request: request(steps), announce: () => {} })).toBe(0);
    const record = readRecords('demo').at(-1);
    expect(record.steps.map((step) => step.status)).toEqual(['pass', 'skipped-local']);
    expect(record.summary).toContain('1 skipped-local');
  });

  it('makes a second run wait for the lock and gives up with a plain reason', async () => {
    const release = await acquireRunLock({ project: 'demo', runId: 'first', timeoutMs: 1000 });
    await expect(acquireRunLock({ project: 'demo', runId: 'second', timeoutMs: 50, pollMs: 10 })).rejects.toThrow(/still holds/);
    release();
    (await acquireRunLock({ project: 'demo', runId: 'third', timeoutMs: 1000 }))();
  });
});

describe('a local merge', () => {
  const pass = (sha, extra = {}) => ({ kind: 'check-run', id: newRunId(), commit: sha, status: 'pass', steps: [{ name: 'lint', required: true, status: 'pass' }, { name: 'upgrade', required: false, status: 'skipped-local' }], ...extra });
  const feature = () => {
    git(repo, 'checkout', '-q', '-b', 'feat/x');
    const sha = commitFile('feature.txt', 'feature\n');
    git(repo, 'checkout', '-q', 'main');
    return sha;
  };
  const merge = (options = {}, positional = []) => mergeVerb.run(positional, { local: true, head: 'feat/x', base: 'main', ...options }, ctxOf());

  it('asks for --local', async () => {
    await expect(mergeVerb.run([], {}, ctxOf())).rejects.toThrow(/--local/);
  });

  it('refuses without a check run, with a failing required step and with a partial run', async () => {
    const sha = feature();
    await expect(merge()).rejects.toThrow(/no check run/);
    writeRecord(recordFile('demo', 'r1'), pass(sha, { steps: [{ name: 'lint', required: true, status: 'fail' }] }));
    await expect(merge()).rejects.toThrow(/lint \(fail\)/);
    writeRecord(recordFile('demo', 'r2'), pass(sha, { partial: true }));
    await expect(merge()).rejects.toThrow(/only some steps/);
    writeRecord(recordFile('demo', 'r3'), pass(sha, { status: 'running' }));
    await expect(merge()).rejects.toThrow(/still running/);
    expect(existsSync(join(repo, 'feature.txt'))).toBe(false);
  });

  it('merges a passing head, deletes the merged branch and prints the merge commit', async () => {
    const sha = feature();
    commitFile('moved.txt', 'base moved\n');
    writeRecord(recordFile('demo', 'r1'), pass(sha));
    const printed = [];
    const original = console.log;
    console.log = (text) => printed.push(text);
    try {
      expect(await merge({}, [])).toBe(0);
    } finally {
      console.log = original;
    }
    expect(printed.at(-1)).toBe(git(repo, 'rev-parse', 'HEAD'));
    expect(git(repo, 'rev-list', '--parents', '-n', '1', 'HEAD').split(' ')).toHaveLength(3);
    expect(existsSync(join(repo, 'feature.txt'))).toBe(true);
    expect(git(repo, 'branch', '--list', 'feat/x')).toBe('');
  });

  it('stops on a conflict with a clear message and leaves the base as it was', async () => {
    git(repo, 'checkout', '-q', '-b', 'feat/x');
    const sha = commitFile('README.md', 'from the branch\n');
    git(repo, 'checkout', '-q', 'main');
    const tip = commitFile('README.md', 'from main\n');
    writeRecord(recordFile('demo', 'r1'), pass(sha));
    await expect(merge()).rejects.toThrow(/Conflicts in README\.md/);
    expect(git(repo, 'rev-parse', 'HEAD')).toBe(tip);
    expect(git(repo, 'status', '--porcelain')).toBe('');
    expect(git(repo, 'branch', '--list', 'feat/x')).toContain('feat/x');
  });

  it('judges the gate by the required steps only', () => {
    const alias = 'demo';
    expect(mergeBlocker(pass('abcdef1234567'), { sha: 'abcdef1234567', alias, pr: 'PR-1' })).toBeNull();
    expect(mergeBlocker(pass('abc', { steps: [] }), { sha: 'abc', alias, pr: null })).toMatch(/no required step/);
  });
});
