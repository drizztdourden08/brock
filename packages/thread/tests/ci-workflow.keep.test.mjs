/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { planSteps, targetOf } from '../src/ci/ci-plan.mjs';
import { eventNameOf, expand, judge } from '../src/ci/workflow-expr.mjs';
import { inNeedsOrder, readWorkflow } from '../src/ci/workflow-jobs.mjs';
import { matrixEntries } from '../src/ci/workflow-matrix.mjs';
import { byName, WORKFLOW, workspace } from './ci-workflow-fixture.mjs';

describe('expressions and conditions', () => {
  const scope = { env: { A: 'x' }, matrix: { os: 'windows-latest' }, eventName: 'push', runnerOs: 'Windows' };

  it('expands simple env, matrix, secret and event values and reports the rest', () => {
    expect(expand("${{ env.A }}-${{ matrix.os }}-${{ secrets.T || 'fallback' }}-${{ github.event_name }}", scope).text).toBe('x-windows-latest-fallback-push');
    expect(expand('${{ secrets.T }}', scope).text).toBe('');
    expect(expand('go ${{ github.sha }} ${{ hashFiles(\'a\') }}', scope).unresolved).toEqual(['${{ github.sha }}', "${{ hashFiles('a') }}"]);
  });

  it('judges event_name comparisons and lets the rest run', () => {
    expect(judge("github.event_name == 'push'", scope).run).toBe(true);
    expect(judge("${{ github.event_name != 'push' }}", scope).run).toBe(false);
    expect(judge("github.event_name == 'pull_request' || github.event_name == 'push'", scope).run).toBe(true);
    expect(judge("github.ref == 'refs/heads/main'", scope).run).toBe(true);
    expect(judge('always()', scope)).toEqual({ run: true, afterFailure: true });
    expect(eventNameOf('pr')).toBe('pull_request');
  });

  it('builds matrix entries with exclude and include', () => {
    expect(matrixEntries(null)).toEqual([{}]);
    expect(matrixEntries({ os: ['a', 'b'], node: [1, 2], exclude: [{ os: 'a', node: 2 }], include: [{ os: 'c' }] })).toEqual([{ os: 'a', node: 1 }, { os: 'b', node: 1 }, { os: 'b', node: 2 }, { os: 'c' }]);
    expect(matrixEntries('${{ fromJson(x) }}')).toBeNull();
  });

  it('orders jobs after the jobs they need and refuses a circle', () => {
    const jobs = readWorkflow(WORKFLOW).jobs;
    expect(inNeedsOrder(jobs).map((job) => job.id)).toEqual(['prepare', 'later', 'matrixed']);
    expect(() => inNeedsOrder([{ id: 'a', needs: ['b'] }, { id: 'b', needs: ['a'] }])).toThrow(/circle/);
  });
});

describe('the plan of a workflow', () => {
  const plan = (extra = {}) => planSteps({ workspace, workflowText: WORKFLOW, platform: 'win32', trigger: 'manual', ...extra });

  it('names every step job / step, with the job as a field, and puts needs first', () => {
    const steps = plan();
    expect(steps.map((step) => step.job)).toEqual([...Array(9).fill('prepare'), 'later', 'matrixed (windows-latest)', 'matrixed (ubuntu-24.04)', 'matrixed (macos-latest)']);
    expect(steps[0].name).toBe('prepare / actions/checkout@v7');
    expect(steps[2].name).toBe('prepare / Mark with simple expressions');
    expect(steps[9].name).toBe('later / node tools/mark.mjs later');
    expect(steps.every((step) => step.jobId)).toBe(true);
  });

  it('turns the common actions into no-ops, copies artifacts and skips the unknown ones with their name', () => {
    const steps = byName(plan());
    expect(steps['prepare / actions/checkout@v7'].noop).toMatch(/checkout/);
    expect(steps['prepare / actions/setup-node@v7'].noop).toBeTruthy();
    expect(steps['prepare / Keep the marks']).toMatchObject({ always: true, upload: { name: 'marks', paths: ['order.txt'], ifNoFiles: 'warn' } });
    expect(steps['prepare / Third party action'].skip).toContain('some/unknown-action');
  });

  it('resolves simple expressions, empties secrets and skips what it cannot resolve', () => {
    const steps = byName(plan());
    expect(steps['prepare / Mark with simple expressions']).toMatchObject({ shell: 'bash', env: { LEVEL: 'dflt', NODE_AUTH_TOKEN: '' } });
    expect(steps['prepare / Needs a sha'].skip).toContain('${{ github.sha }}');
  });

  it('judges if on the run trigger', () => {
    expect(byName(plan({ trigger: 'manual' }))['prepare / Only on push'].skip).toMatch(/condition/);
    expect(byName(plan({ trigger: 'manual' }))['prepare / Not on push'].skip).toBeUndefined();
    expect(byName(plan({ trigger: 'push' }))['prepare / Only on push'].skip).toBeUndefined();
    expect(byName(plan({ trigger: 'push' }))['prepare / Not on push'].skip).toMatch(/condition/);
  });

  it('uses the offline install for a pnpm install and skips Linux-only tools on Windows', () => {
    const install = plan().find((step) => step.name === 'prepare / Install from the registry');
    expect(install.command).toBe('pnpm --version && echo pnpm install --offline --frozen-lockfile');
    const sudo = planSteps({ workspace, workflowText: 'jobs:\n  a:\n    runs-on: ubuntu-24.04\n    steps:\n      - run: sudo apt-get install -y x\n', platform: 'win32' });
    expect(sudo[0].skip).toMatch(/Linux-only/);
    expect(planSteps({ workspace, workflowText: 'jobs:\n  a:\n    runs-on: ubuntu-24.04\n    steps:\n      - run: sudo apt-get install -y x\n', platform: 'linux' })[0].skip).toBeUndefined();
  });

  it('runs only the matrix entries of this machine and skips the others with the reason', () => {
    const steps = plan().filter((step) => step.jobId === 'matrixed');
    expect(steps.map((step) => [step.job, Boolean(step.skip)])).toEqual([['matrixed (windows-latest)', false], ['matrixed (ubuntu-24.04)', true], ['matrixed (macos-latest)', true]]);
    expect(steps[0]).toMatchObject({ shell: 'pwsh', command: 'node tools/mark.mjs matrix-windows-latest' });
    expect(steps[1].skip).toMatch(/runs on Linux; this machine runs Windows/);
    expect(plan({ platform: 'linux' }).filter((step) => step.jobId === 'matrixed').map((step) => Boolean(step.skip))).toEqual([true, false, true]);
  });

  it('takes required from requiredChecks by step or job name, and every runnable step by default', () => {
    expect(plan().filter((step) => step.skip).every((step) => step.required === false)).toBe(true);
    const picked = plan({ workspace: { ...workspace, publish: { requiredChecks: ['later', 'prepare / Not on push'] } } });
    expect(picked.filter((step) => step.required).map((step) => step.name)).toEqual(['prepare / Not on push', 'later / node tools/mark.mjs later']);
  });

  it('narrows to a job by its id, takes another workflow text and keeps the gate path', () => {
    expect(plan({ job: 'later' }).map((step) => step.name)).toEqual(['later / node tools/mark.mjs later']);
    expect(plan({ job: 'matrixed' })).toHaveLength(3);
    expect(planSteps({ workspace: { ...workspace, gate: { scripts: ['lint'] } } }).map((step) => step.name)).toEqual(['install', 'lint']);
  });

  it('reads a free word as a job name or a step name', () => {
    const gate = planSteps({ workspace: { ...workspace, gate: { scripts: ['lint', 'test'] } } });
    expect(targetOf(gate, 'lint', 'all', null)).toEqual({ job: 'all', only: ['lint'] });
    expect(targetOf(gate, 'gate', 'all', null)).toEqual({ job: 'gate', only: null });
    expect(targetOf(plan(), 'Needs a sha', 'all', ['later / node tools/mark.mjs later']).only).toHaveLength(2);
    expect(targetOf(plan(), null, 'later', null)).toEqual({ job: 'later', only: null });
    expect(() => targetOf(gate, 'gate', 'other', null)).toThrow(/Give only one/);
    expect(() => targetOf(gate, 'nope', 'all', null)).toThrow(/Jobs: gate, all\. Steps: install, lint, test\./);
  });
});

