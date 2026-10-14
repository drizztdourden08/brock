/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { renderReport } from '../src/upgrade/render-report.mjs';
import { runSteps } from '../src/upgrade/run-steps.mjs';

const GATE = ['pnpm install --frozen-lockfile', 'brock check', 'pnpm lint', 'pnpm lint:md', 'pnpm test'];

const reportOf = (results, failed) => renderReport(
  { app: 'fixture', plan: { mode: 'registry', current: '0.36.0', target: '0.38.0' }, worktree: { path: 'w', branch: 'agent/brock-0-38-0' } },
  { fields: [], steps: results, failed },
  { migrations: null, changelog: [] },
);

describe('the step table of the upgrade report', () => {
  it('lists every gate step, brock check and lint:md included, when the gate is green', () => {
    const { results, failed } = runSteps(GATE.map((name) => ({ name, run: () => 0 })), () => {});
    const report = reportOf(results, failed);
    for (const name of GATE) expect(report).toContain(`| ${name} | passed |`);
  });

  it('lists the steps after a failed one as not run, so the table keeps every step', () => {
    const { results, failed } = runSteps(GATE.map((name) => ({ name, run: () => (name === 'brock check' ? 1 : 0) })), () => {});
    expect(failed).toBe('brock check');
    expect(results.map((step) => step.status)).toEqual(['passed', 'failed', 'not run', 'not run', 'not run']);
    const report = reportOf(results, failed);
    expect(report).toContain('| brock check | failed: exit 1 |');
    expect(report).toContain('| pnpm lint:md | not run: brock check failed first |');
  });
});
