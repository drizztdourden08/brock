/* @layer tooling-scripts @kind test */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readRecords } from '../src/ci/check-record.mjs';
import { planSteps } from '../src/ci/ci-plan.mjs';
import { runCi } from '../src/ci/run-ci.mjs';
import { BROKEN, byName, fixtureRepo, git, WORKFLOW, workspace } from './ci-workflow-fixture.mjs';

const fixture = fixtureRepo();

describe('E2 a run of the workflow', { tags: ['e2e'] }, () => {
  const request = (workflowText, extra = {}) => ({
    project: 'demo',
    sha: git(fixture.repo(), 'rev-parse', 'HEAD'),
    branch: 'main',
    pr: null,
    trigger: 'manual',
    plan: planSteps({ workspace, workflowText, trigger: 'manual' }),
    partial: false,
    waitMs: 5000,
    ...extra,
  });
  const run = (req) => runCi({ ctx: { rootDir: fixture.repo(), workspace, log: () => {} }, runId: '20261029T100000000Z-aaaa', request: req, announce: () => {} });

  it('runs the jobs in needs order with their env, keeps the artifact and skips what cannot run', async () => {
    const code = await run(request(WORKFLOW.replace('pnpm --version && echo', 'echo')));
    const record = readRecords('demo').at(-1);
    const steps = byName(record.steps);
    expect(code).toBe(0);
    expect(record.steps.map((step) => step.job).slice(0, 1)).toEqual(['prepare']);
    expect(steps['prepare / actions/checkout@v7']).toMatchObject({ status: 'pass', exitCode: 0 });
    expect(steps['prepare / Mark with simple expressions'].status).toBe('pass');
    expect(steps['prepare / Needs a sha'].status).toBe('skipped-local');
    expect(steps['prepare / Third party action'].status).toBe('skipped-local');
    expect(steps['prepare / Only on push'].status).toBe('skipped-local');
    expect(steps['prepare / Not on push'].status).toBe('pass');
    expect(steps['later / node tools/mark.mjs later'].status).toBe('pass');
    const here = { win32: 'windows-latest', linux: 'ubuntu-24.04', darwin: 'macos-latest' }[process.platform];
    expect(record.steps.filter((step) => step.job.startsWith('matrixed') && step.status === 'pass').map((step) => step.job)).toEqual([`matrixed (${here})`]);
    const kept = steps['prepare / Keep the marks'];
    expect(kept.artifact.files).toEqual(['order.txt']);
    const marks = readFileSync(join(kept.artifact.dir, 'order.txt'), 'utf8').split(/\r?\n/);
    expect(marks.slice(0, 2)).toEqual(['prepare hi-dflt-[]', 'not-on-push']);
    expect(existsSync(join(fixture.repo(), 'order.txt'))).toBe(false);
  });

  it('stops a failed job, still runs its always steps and independent jobs, and does not run a dependent job', async () => {
    const code = await run(request(BROKEN));
    const record = readRecords('demo').at(-1);
    expect(code).toBe(1);
    expect(record.steps.map((step) => [step.name, step.status])).toEqual([
      ['broken / Fails', 'fail'],
      ['broken / Skipped by the failure', 'not-run'],
      ['broken / Cleanup', 'pass'],
      ['free / node tools/mark.mjs free', 'pass'],
      ['downstream / node tools/mark.mjs downstream', 'not-run'],
    ]);
    expect(record.steps[0].exitCode).toBe(3);
    expect(record.steps.every((step) => step.job)).toBe(true);
  });
});
