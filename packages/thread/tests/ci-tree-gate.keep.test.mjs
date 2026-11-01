/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { gateScope } from '../src/ci/gate-scope.mjs';
import { holderState } from '../src/ci/lock-holder.mjs';
import { stopPid, stopTree } from '../src/ci/stop-tree.mjs';
import { watchStep } from '../src/ci/step-watchdog.mjs';
import { parseTimeouts, runBudgetMs, timeoutMs } from '../src/ci/step-timeouts.mjs';
import { applyCache, keyOf, passFor, treeOf } from '../src/ci/tree-cache.mjs';

const planned = (name, extra = {}) => ({ name, command: `pnpm run ${name}`, ...extra });
const stepOf = (plan, status = 'pending') => ({ name: plan.name, status, cacheKey: keyOf(plan) });
const recordOf = (id, tree, steps) => ({ id, tree, steps });

describe('K1 reuse of a step result by git tree', { tags: ['critical'] }, () => {
  const plan = [planned('install', { command: 'pnpm install --offline --frozen-lockfile' }), planned('lint'), planned('test')];
  const passed = (id, tree, names = ['install', 'lint', 'test'], from = {}) => recordOf(id, tree, plan.filter((p) => names.includes(p.name)).map((p) => ({ ...stepOf(p, 'pass'), ...from })));
  const fresh = (tree) => ({ tree, steps: plan.map((p) => stepOf(p)) });

  it('asks git for the tree of the commit', () => {
    const calls = [];
    expect(treeOf('abc', (args) => { calls.push(args); return 't1'; })).toBe('t1');
    expect(calls).toEqual([['rev-parse', 'abc^{tree}']]);
  });

  it('keys a step by name, command and step env', () => {
    expect(keyOf(planned('lint'))).toBe(keyOf(planned('lint')));
    expect(keyOf(planned('lint'))).not.toBe(keyOf(planned('lint', { command: 'pnpm run lint --all' })));
    expect(keyOf(planned('lint'))).not.toBe(keyOf(planned('lint', { stepEnv: { BROCK_LINT_MODE: 'all' } })));
    expect(keyOf(planned('lint'))).not.toBe(keyOf(planned('test')));
  });

  it('finds the newest pass of the same tree and ignores failures and other trees', () => {
    const key = keyOf(planned('test'));
    const records = [passed('r1', 'tA'), recordOf('r2', 'tA', [stepOf(planned('test'), 'fail')]), passed('r3', 'tB')];
    expect(passFor(records, 'tA', key)).toBe('r1');
    expect(passFor(records, 'tB', key)).toBe('r3');
    expect(passFor(records, 'tC', key)).toBeNull();
  });

  it('points a reused step at the run that ran it', () => {
    const records = [passed('r1', 'tA'), passed('r2', 'tA', ['test'], { cachedFrom: 'r1' })];
    expect(passFor(records, 'tA', keyOf(planned('test')))).toBe('r1');
  });

  it('skips every step of an unchanged tree, install included', () => {
    const record = fresh('tA');
    expect(applyCache(record, plan, [passed('r1', 'tA')])).toBe(3);
    expect(record.steps.map((s) => s.status)).toEqual(['pass', 'pass', 'pass']);
    expect(record.steps[1]).toMatchObject({ cachedFrom: 'r1', note: 'cached pass from r1', exitCode: 0, durationMs: 0 });
  });

  it('keeps install when any other step still has to run', () => {
    const record = fresh('tA');
    expect(applyCache(record, plan, [passed('r1', 'tA', ['install', 'lint'])])).toBe(1);
    expect(record.steps.map((s) => s.status)).toEqual(['pending', 'pass', 'pending']);
  });

  it('reuses nothing for a changed tree or a record with no tree', () => {
    expect(applyCache(fresh('tB'), plan, [passed('r1', 'tA')])).toBe(0);
    expect(applyCache({ steps: plan.map((p) => stepOf(p)) }, plan, [passed('r1', 'tA')])).toBe(0);
  });

  it('never reuses a skipped, no-op or upload step', () => {
    const odd = [planned('a', { skip: 'x' }), planned('b', { noop: 'x' }), planned('c', { upload: {} })];
    const record = { tree: 'tA', steps: odd.map((p) => stepOf(p)) };
    const before = recordOf('r1', 'tA', odd.map((p) => stepOf(p, 'pass')));
    expect(applyCache(record, odd, [before])).toBe(0);
  });
});

describe('K1 hard time limit and process tree kill', { tags: ['critical'] }, () => {
  const timers = () => {
    const queue = [];
    return { queue, setTimer: (fn, ms) => { queue.push({ fn, ms }); return queue.length; }, clearTimer: (id) => { queue[id - 1].fn = null; } };
  };

  it('stops the tree of the child once when the time is up', () => {
    const t = timers();
    const stopped = [];
    const watch = watchStep({ child: { pid: 4321 }, timeoutMs: 600000, stop: (c) => stopped.push(c.pid), onTimeout: () => stopped.push('timeout'), setTimer: t.setTimer, clearTimer: t.clearTimer });
    expect(t.queue[0].ms).toBe(600000);
    expect(watch.state.timedOut).toBe(false);
    t.queue[0].fn();
    expect(stopped).toEqual([4321, 'timeout']);
    expect(watch.state.timedOut).toBe(true);
  });

  it('does not stop a step that finished in time', () => {
    const t = timers();
    const stopped = [];
    const watch = watchStep({ child: { pid: 1 }, timeoutMs: 5, stop: () => stopped.push('x'), setTimer: t.setTimer, clearTimer: t.clearTimer });
    watch.cancel();
    expect(t.queue[0].fn).toBeNull();
    expect(stopped).toEqual([]);
  });

  it('kills by pid with taskkill on Windows and falls back to the child', () => {
    const calls = [];
    expect(stopPid(77, { platform: 'win32', exec: (...args) => calls.push(args) })).toBe(true);
    expect(calls).toEqual([['taskkill', ['/PID', '77', '/T', '/F'], { stdio: 'ignore' }]]);
    const signals = [];
    stopPid(78, { platform: 'linux', kill: (pid, signal) => signals.push([pid, signal]) });
    expect(signals).toEqual([[78, 'SIGTERM']]);
    let killed = 0;
    stopTree({ pid: 79, kill: () => { killed += 1; } }, { platform: 'win32', exec: () => { throw new Error('gone'); } });
    expect(killed).toBe(1);
    expect(stopPid(undefined, { exec: () => { throw new Error('never'); } })).toBe(false);
  });

});

describe('K1 step time limits and lock holders', { tags: ['critical'] }, () => {
  it('gives each step its default limit, an override and a longer release lint', () => {
    expect(timeoutMs('install')).toBe(10 * 60000);
    expect(timeoutMs('gate / test')).toBe(20 * 60000);
    expect(timeoutMs('lint (2)')).toBe(15 * 60000);
    expect(timeoutMs('lint', { trigger: 'release' })).toBe(45 * 60000);
    expect(timeoutMs('lint', { overrides: { lint: 3 }, trigger: 'release' })).toBe(3 * 60000);
    expect(timeoutMs('something else')).toBe(30 * 60000);
  });

  it('parses the override list and refuses a bad one', () => {
    expect(parseTimeouts('test=30, lint=20')).toEqual({ test: 30, lint: 20 });
    expect(parseTimeouts(undefined)).toEqual({});
    expect(() => parseTimeouts('test')).toThrow(/name=minutes/);
    expect(() => parseTimeouts('test=0')).toThrow(/name=minutes/);
  });

  it('budgets a run as the sum of its limits plus slack', () => {
    expect(runBudgetMs([{ name: 'install' }, { name: 'test' }])).toBe((10 + 20 + 2) * 60000);
  });

  it('treats a lock holder past its own budget as hung, a dead pid as dead', () => {
    const alive = { now: 1000, isAlive: () => true };
    expect(holderState(null, alive)).toBe('unknown');
    expect(holderState({ pid: 1, deadline: 2000 }, alive)).toBe('busy');
    expect(holderState({ pid: 1, deadline: 999 }, alive)).toBe('hung');
    expect(holderState({ pid: 1 }, alive)).toBe('busy');
    expect(holderState({ pid: 1, deadline: 999 }, { now: 1000, isAlive: () => false })).toBe('dead');
  });
});

describe('K1 what the gate covers', { tags: ['critical'] }, () => {
  const git = (answers) => (args) => answers[args[0]] ?? null;
  const sha = 'abcdef0123';

  it('scopes tests and lint to the merge base on a merge gate', () => {
    const scope = gateScope({ trigger: 'pr', sha, base: 'local/main', git: git({ 'merge-base': 'mb1' }) });
    expect(scope).toEqual({ testRef: 'mb1', lintMode: 'changed', lintBase: 'local/main' });
  });

  it('scopes tests to the last release tag and lints everything on a release', () => {
    const scope = gateScope({ trigger: 'release', sha, base: 'local/main', git: git({ describe: 'v0.68.5', 'merge-base': 'mb1' }) });
    expect(scope).toEqual({ testRef: 'v0.68.5', lintMode: 'all', lintBase: 'local/main' });
    expect(gateScope({ trigger: 'release', sha, base: 'b', git: git({ 'merge-base': 'mb1' }) }).testRef).toBe('mb1');
  });

  it('refuses to fall back to the whole suite', () => {
    expect(() => gateScope({ trigger: 'pr', sha, base: 'local/main', git: git({}) })).toThrow(/never runs the whole suite/);
  });
});
