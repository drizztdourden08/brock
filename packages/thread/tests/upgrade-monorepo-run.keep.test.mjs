/* @layer tooling-scripts @kind test */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { gateSteps } from '../src/upgrade/gate-steps.mjs';
import { runSteps } from '../src/upgrade/run-steps.mjs';
import { upgradeApps } from '../src/upgrade/upgrade-apps.mjs';
import { writeReports } from '../src/upgrade/write-reports.mjs';
import { bumpApp } from '../src/upgrade/bump-app.mjs';
import { checkout, monorepo, removeMadeDirs } from './upgrade-monorepo-fixture.mjs';

afterEach(removeMadeDirs);

describe('S2 the upgrade steps run brock in the app', { tags: ['standard'] }, () => {
  it('syncs and migrates in the app from its own pins, and writes the report there', () => {
    const root = monorepo();
    const plan = { mode: 'link', current: '0.16.0', target: '0.17.0', checkout: checkout(), relink: false };
    const apps = upgradeApps(root, plan);
    const fields = bumpApp(root, plan, apps.map((app) => app.dir));
    process.env.BROCK_STUB_LOG = join(root, 'brock-calls.log');
    const steps = gateSteps({ path: root, name: 'brock-0-17-0', plan: { ...plan, mode: 'registry' }, review: false, apps });
    const { results, failed } = runSteps(steps.filter((step) => step.name.startsWith('brock sync') || step.name.startsWith('brock migrate')), () => {});
    expect(failed).toBeNull();
    expect(results.map((step) => `${step.name}: ${step.status}`)).toEqual(['brock sync in apps/desktop: passed', 'brock migrate in apps/desktop: passed']);
    const calls = readFileSync(process.env.BROCK_STUB_LOG, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    expect(calls.map(({ cwd }) => cwd)).toEqual([join(root, 'apps', 'desktop'), join(root, 'apps', 'desktop')]);
    expect(calls[0].args).toEqual(['sync']);
    expect(calls[1].args).toEqual(['migrate', '--from', '0.16.0', '--to', '0.17.0', '--tessera-from', '0.15.0', '--report', '.user-data/upgrade-migrations.json']);

    const reports = writeReports({ app: 'fixture', plan, worktree: { path: root, branch: 'brock-0-17-0' }, apps }, { fields, steps: results, failed }, []);
    expect(reports).toEqual([join(root, 'apps', 'desktop', '.brock', 'upgrade-report.md')]);
    const report = readFileSync(reports[0], 'utf8');
    expect(report).toContain('- App: fixture (apps/desktop)');
    expect(report).toContain('- 0.17.0 stub-step (brock-build): stub');
    expect(report).toContain('- apps/desktop: brock.version');
    expect(existsSync(join(root, '.brock', 'upgrade-report.md'))).toBe(false);
  });

  it.each(['check', 'gate'])('runs brock %s in each app: the managed files as CI checks them, and the gate steps of brock.config.ts', (verb) => {
    const root = monorepo();
    process.env.BROCK_STUB_LOG = join(root, 'brock-calls.log');
    const apps = upgradeApps(root, { current: '0.16.0' });
    const steps = gateSteps({ path: root, name: 'brock-0-17-0', plan: { mode: 'link', target: '0.17.0' }, review: false, apps });
    const { results } = runSteps(steps.filter((step) => step.name === `brock ${verb} in apps/desktop`), () => {});
    expect(results.map((step) => step.status)).toEqual(['passed']);
    const [call] = readFileSync(process.env.BROCK_STUB_LOG, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    expect(call).toEqual({ cwd: join(root, 'apps', 'desktop'), args: [verb] });
  });
});
