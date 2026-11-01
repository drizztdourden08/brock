/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { newRunId, readRecords } from '../src/ci/check-record.mjs';
import { ciWorktreesFolder } from '../src/ci/ci-worktree.mjs';
import { localpkgRequest } from '../src/ci/localpkg-request.mjs';
import { runCi } from '../src/ci/run-ci.mjs';

const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const workspace = { name: 'demo', base: 'main', protectedBranches: ['main'], worktreesDir: '.worktrees', publish: {}, gate: undefined };
const TESSERA = '@drizztdourden08/tessera';

let home = '';
let repo = '';
let lines = [];

beforeEach(() => {
  vi.stubEnv('COORD_PROJECT', undefined);
  home = mkdtempSync(join(tmpdir(), 'brock-ci-lp-home-'));
  vi.stubEnv('COORD_HOME', home);
  repo = mkdtempSync(join(tmpdir(), 'brock-ci-lp-repo-'));
  lines = [];
  git(repo, 'init', '-q', '-b', 'main');
  git(repo, 'config', 'user.name', 't');
  git(repo, 'config', 'user.email', 't@t');
  writeFileSync(join(repo, 'package.json'), JSON.stringify({ name: 'demo', dependencies: { [TESSERA]: '^0.46.0' } }));
  git(repo, 'add', '-A');
  git(repo, 'commit', '-q', '-m', 'init');
});

afterEach(() => {
  vi.unstubAllEnvs();
  for (const dir of [home, repo, ciWorktreesFolder(repo)]) rmSync(dir, { recursive: true, force: true });
});

describe('brock ci --localpkg runs', { tags: ['standard'] }, () => {
  const node = (code) => `node -e "process.exit(${code})"`;
  const plan = (...codes) => codes.map((code, index) => ({ name: `s${index}`, command: node(code), job: 'gate', required: true }));
  const localpkg = (calls, failOn = null) => ({
    binary: { command: 'localpkg', prefix: [] },
    builds: [{ name: TESSERA, version: '0.46.0', head: 'aaa1111', unmerged: true }],
    exec: (command, args, options) => {
      calls.push({ command, args, cwd: options.cwd });
      if (args[0] === failOn) throw new Error('boom\nmore');
      return '';
    },
  });
  const run = (extra) => runCi({
    ctx: { rootDir: repo, workspace, log: (line) => lines.push(line) },
    runId: newRunId(),
    request: { project: 'demo', sha: git(repo, 'rev-parse', 'HEAD'), branch: 'main', pr: null, trigger: 'manual', partial: false, waitMs: 5000, ...extra },
    announce: () => {},
  });

  it('uses localpkg on the temporary worktree before the steps and turns it off after them', async () => {
    const calls = [];
    expect(await run({ plan: plan(0, 0), localpkg: localpkg(calls) })).toBe(0);
    const worktree = calls[0].args[1];
    expect(calls.map((call) => call.args)).toEqual([
      ['use', worktree, '--no-install', '--unmerged'],
      ['off', worktree, '--no-install'],
    ]);
    expect(worktree).toContain('.brock-ci');
    const record = readRecords('demo').at(-1);
    expect(record).toMatchObject({ status: 'pass', localpkg: true, localBuilds: [{ build: `${TESSERA}@0.46.0`, unmerged: true }] });
    expect(record.summary).toContain('used 1 local build(s), 1 unmerged');
  });

  it('turns localpkg off when a step fails', async () => {
    const calls = [];
    expect(await run({ plan: plan(0, 3), localpkg: localpkg(calls) })).toBe(1);
    expect(calls.map((call) => call.args[0])).toEqual(['use', 'off']);
  });

  it('logs a failure of localpkg off without failing the run', async () => {
    expect(await run({ plan: plan(0), localpkg: localpkg([], 'off') })).toBe(0);
    expect(lines.some((line) => line.includes('localpkg off failed') && line.includes('boom'))).toBe(true);
  });

  it('fails the run before any step when localpkg cannot prepare the worktree, and still turns it off', async () => {
    const calls = [];
    expect(await run({ plan: plan(0, 0), localpkg: localpkg(calls, 'use') })).toBe(1);
    const record = readRecords('demo').at(-1);
    expect(record.status).toBe('fail');
    expect(record.steps.map((step) => step.status)).toEqual(['not-run', 'not-run']);
    expect(record.summary).toContain('localpkg could not prepare the temporary worktree');
    expect(calls.map((call) => call.args[0])).toEqual(['use', 'off']);
  });

  it('never calls localpkg without the flag', async () => {
    expect(await run({ plan: plan(0), localpkg: null })).toBe(0);
    expect(readRecords('demo').at(-1)).toMatchObject({ localpkg: false });
  });
});

describe('the localpkg of a run', { tags: ['standard'] }, () => {
  const exec = (command, args) => {
    if (command === 'git') return 'package.json\n';
    return args.includes('status') ? JSON.stringify({ builds: [], consumers: [] }) : '';
  };

  it('fails with one sentence when localpkg cannot be resolved', () => {
    vi.stubEnv('LOCALPKG_BIN', '');
    const missing = () => {
      throw new Error('missing');
    };
    expect(() => localpkgRequest({ exec: missing, cwd: repo })).toThrow(/needs localpkg and none was found/);
  });

  it('lists the local builds the repo depends on, with their head and unmerged flag', () => {
    const state = mkdtempSync(join(tmpdir(), 'brock-ci-lp-state-'));
    const packages = { [TESSERA]: { version: '0.46.0', head: 'aaa1111', unmerged: true }, '@drizztdourden08/other': { version: '1.0.0', head: 'zzz', unmerged: false } };
    writeFileSync(join(state, 'index.json'), JSON.stringify({ packages }));
    vi.stubEnv('LOCALPKG_HOME', state);
    vi.stubEnv('LOCALPKG_BIN', 'localpkg.mjs');
    const request = localpkgRequest({ exec, cwd: repo });
    rmSync(state, { recursive: true, force: true });
    expect(request.builds).toEqual([{ name: TESSERA, version: '0.46.0', head: 'aaa1111', unmerged: true }]);
    expect(request.binary).toEqual({ command: 'node', prefix: ['localpkg.mjs'] });
  });
});
