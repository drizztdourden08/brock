/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { planSteps } from '../src/ci/ci-plan.mjs';
import { LOCALPKG_INSTALL_COMMAND } from '../src/ci/ci.constants.mjs';
import { newRecord, stepRecord } from '../src/ci/record-shape.mjs';
import { summarize } from '../src/ci/summarize.mjs';
import { keyOf } from '../src/ci/tree-cache.mjs';

const workspace = { name: 'demo', base: 'main', publish: {}, gate: { scripts: ['lint', 'test'] } };
const scope = { testRef: 'mb1', lintMode: 'changed', lintBase: 'local/main' };
const build = (extra = {}) => ({ name: '@drizztdourden08/tessera', version: '0.46.0', head: 'aaa1111', unmerged: false, ...extra });
const local = (...builds) => ({ builds: builds.length ? builds : [build()] });
const planned = { name: 'lint', command: 'pnpm run lint' };
const request = (extra = {}) => ({ project: 'demo', sha: 'abc', branch: 'b', pr: null, trigger: 'manual', partial: false, ...extra });

describe('brock ci --localpkg logic', { tags: ['critical'] }, () => {
  it('installs with --no-frozen-lockfile only when the run uses local builds', () => {
    expect(planSteps({ workspace }).find((step) => step.name === 'install').command).toBe('pnpm install --offline --frozen-lockfile');
    expect(planSteps({ workspace, localpkg: true }).find((step) => step.name === 'install').command).toBe(LOCALPKG_INSTALL_COMMAND);
    expect(LOCALPKG_INSTALL_COMMAND).toBe('pnpm install --offline --no-frozen-lockfile');
  });

  it('leaves the other steps of the plan alone', () => {
    const plain = planSteps({ workspace, scope });
    const withLocal = planSteps({ workspace, scope, localpkg: true });
    expect(withLocal.slice(1)).toEqual(plain.slice(1));
  });

  it('runs the changed tests with --base', () => {
    const step = planSteps({ workspace, scope }).find((entry) => entry.name === 'test');
    expect(step.command).toBe('pnpm run test --base mb1');
  });

  it('keeps the old key without local builds and changes it with them', () => {
    expect(keyOf(planned, null)).toBe(keyOf(planned));
    expect(keyOf(planned, local())).not.toBe(keyOf(planned));
  });

  it('keys a different version, head or package differently, and ignores the order and the unmerged flag', () => {
    const base = keyOf(planned, local());
    expect(keyOf(planned, local(build({ version: '0.46.1' })))).not.toBe(base);
    expect(keyOf(planned, local(build({ head: 'bbb2222' })))).not.toBe(base);
    expect(keyOf(planned, local(build({ name: '@drizztdourden08/brock' })))).not.toBe(base);
    expect(keyOf(planned, local(build({ unmerged: true })))).toBe(base);
    const other = build({ name: '@drizztdourden08/brock', version: '0.116.0', head: 'ccc3333' });
    expect(keyOf(planned, local(build(), other))).toBe(keyOf(planned, local(other, build())));
  });

  it('puts the mode and the builds in the run record', () => {
    const plain = newRecord({ runId: 'r', request: request(), main: 'X:/repo' });
    expect(plain.localpkg).toBe(false);
    expect(plain.localBuilds).toBeUndefined();
    const used = local(build(), build({ name: '@drizztdourden08/brock', version: '0.116.0', unmerged: true }));
    const record = newRecord({ runId: 'r', request: request({ localpkg: used }), main: 'X:/repo' });
    expect(record.localpkg).toBe(true);
    expect(record.localBuilds).toEqual([
      { build: '@drizztdourden08/tessera@0.46.0', unmerged: false },
      { build: '@drizztdourden08/brock@0.116.0', unmerged: true },
    ]);
  });

  it('gives a step of a local run a cache key of its own', () => {
    const place = { project: 'demo', runId: 'r', index: 0 };
    expect(stepRecord(planned, place).cacheKey).toBe(keyOf(planned));
    expect(stepRecord(planned, { ...place, local: local() }).cacheKey).toBe(keyOf(planned, local()));
    expect(stepRecord(planned, { ...place, local: local() }).cacheKey).not.toBe(stepRecord(planned, place).cacheKey);
  });

  it('says in the summary that the run used local builds', () => {
    const steps = [{ name: 'lint', status: 'pass', exitCode: 0 }];
    const localBuilds = [{ build: 'a@1', unmerged: false }, { build: 'b@2', unmerged: true }];
    expect(summarize({ steps })).toBe('1 of 1 step(s) passed.');
    expect(summarize({ steps, localpkg: true, localBuilds })).toBe('1 of 1 step(s) passed; used 2 local build(s), 1 unmerged.');
  });
});
