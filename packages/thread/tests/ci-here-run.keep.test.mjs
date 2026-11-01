/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { newRunId, readRecords } from '../src/ci/check-record.mjs';
import { ciWorktreesFolder } from '../src/ci/ci-worktree.mjs';
import { runCi } from '../src/ci/run-ci.mjs';
import { skipInstall } from '../src/ci/skip-install.mjs';

const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const workspace = { name: 'demo', base: 'main', protectedBranches: ['main'], worktreesDir: '.worktrees', publish: {}, gate: undefined };

let home = '';
let repo = '';

beforeEach(() => {
  vi.stubEnv('COORD_PROJECT', undefined);
  home = mkdtempSync(join(tmpdir(), 'brock-ci-here-home-'));
  vi.stubEnv('COORD_HOME', home);
  repo = mkdtempSync(join(tmpdir(), 'brock-ci-here-repo-'));
  git(repo, 'init', '-q', '-b', 'main');
  git(repo, 'config', 'user.name', 't');
  git(repo, 'config', 'user.email', 't@t');
  writeFileSync(join(repo, 'package.json'), JSON.stringify({ name: 'demo' }));
  git(repo, 'add', 'package.json');
  git(repo, 'commit', '-q', '-m', 'init');
});

afterEach(() => {
  vi.unstubAllEnvs();
  for (const dir of [home, repo, ciWorktreesFolder(repo)]) rmSync(dir, { recursive: true, force: true });
});

describe('brock ci --here runs', { tags: ['standard'] }, () => {
  const node = (code) => `node -e "process.exit(${code})"`;
  const plan = (...codes) => skipInstall([{ name: 'install', command: 'pnpm install --offline --frozen-lockfile', job: 'gate', required: true }, ...codes.map((code, index) => ({ name: `s${index}`, command: node(code), job: 'gate', required: true }))]);
  const run = (steps) => runCi({
    ctx: { rootDir: repo, workspace, log: () => {} },
    runId: newRunId(),
    request: { project: 'demo', sha: git(repo, 'rev-parse', 'HEAD'), branch: 'main', pr: null, trigger: 'pr', partial: false, waitMs: 5000, plan: steps, here: repo },
    announce: () => {},
  });

  it('runs the steps in the checkout, skips the install and makes no temporary worktree', async () => {
    expect(await run(plan(0, 0))).toBe(0);
    const record = readRecords('demo').at(-1);
    expect(record).toMatchObject({ status: 'pass', place: 'here' });
    expect(record.steps.map((step) => step.status)).toEqual(['skipped-local', 'pass', 'pass']);
    expect(record.steps[1].cwd.replace(/\/g, '/')).toBe(repo.replace(/\/g, '/'));
    expect(existsSync(ciWorktreesFolder(repo))).toBe(false);
    expect(existsSync(join(repo, 'package.json'))).toBe(true);
  });

  it('fails the run when a step fails and still leaves the checkout alone', async () => {
    expect(await run(plan(0, 3))).toBe(1);
    expect(readRecords('demo').at(-1)).toMatchObject({ status: 'fail', place: 'here' });
    expect(existsSync(join(repo, 'package.json'))).toBe(true);
  });
});
