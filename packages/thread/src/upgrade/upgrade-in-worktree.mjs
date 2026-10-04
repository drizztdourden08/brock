/* @layer tooling-scripts @kind logic */
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { git } from '../git.mjs';
import { createVerb } from '../worktree/create.mjs';
import { commitVerb } from '../worktree/commit.mjs';
import { excludeLocally } from '../worktree/exclude-worktrees.mjs';
import { worktreePathFor } from '../worktree/paths.mjs';
import { bumpApp } from './bump-app.mjs';
import { changelogBetween } from './changelog-between.mjs';
import { gateSteps } from './gate-steps.mjs';
import { runIn } from './run-in.mjs';
import { runSteps } from './run-steps.mjs';
import { upgradeApps } from './upgrade-apps.mjs';
import { writeReports } from './write-reports.mjs';
import { MIGRATIONS_FILE, REPORT_FILE, WORKTREE_PREFIX } from './upgrade.constants.mjs';

const DEPENDENCY_FILES = [':(glob)**/package.json', 'pnpm-workspace.yaml'];

const worktreeNameFor = (version) => `${WORKTREE_PREFIX}${version.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const installStep = (path) => ({
  name: 'pnpm install',
  skipped: 'no package.json or pnpm-workspace.yaml differs from the base branch',
  run: () => (git(['status', '--porcelain', '--', ...DEPENDENCY_FILES], path) ? runIn.pnpm(path, ['install', '--no-frozen-lockfile']) : null),
});

const printChangelog = (changelog, plan, log) => {
  if (changelog.length === 0) {
    log(`No changelog entry found between ${plan.current ?? 'unknown'} and ${plan.target}.`);
    return;
  }
  log(`Changelog from ${plan.current ?? 'unknown'} to ${plan.target}:`);
  for (const { version, entries } of changelog) {
    log(`  ${version}`);
    for (const entry of entries) log(`    - ${entry}`);
  }
};

const runGate = (worktree, { plan, apps }, { review, log }) => {
  const install = runSteps([installStep(worktree.path)], log);
  const changelog = changelogBetween([worktree.path, ...apps.map((app) => app.dir)], { from: plan.current, to: plan.target, online: plan.mode === 'registry' });
  printChangelog(changelog, plan, log);
  if (install.failed) return { results: install.results, failed: install.failed, changelog };
  const gate = runSteps(gateSteps({ ...worktree, plan, review, apps }), log);
  return { results: [...install.results, ...gate.results], failed: gate.failed, changelog };
};

const commitUpgrade = async (worktree, { plan, report }, ctx) => {
  if (!git(['status', '--porcelain'], worktree.path)) {
    ctx.log('Nothing changed in the app, so there is nothing to commit.');
    return;
  }
  await commitVerb.run([worktree.name], { message: `Upgrade Brock to ${plan.target}` }, ctx);
  const title = `"Upgrade Brock to ${plan.target}"`;
  ctx.log(`Green. Open the pull request with: ${ctx.workspace.name} pr open ${worktree.name} --title ${title} --body-file ${report}`);
};

const prepareApps = (worktree, plan, ctx) => {
  const apps = upgradeApps(worktree.path, plan, ctx.rootDir);
  for (const app of apps) {
    excludeLocally(ctx.rootDir, `/${app.label === '.' ? '' : `${app.label}/`}${REPORT_FILE}`);
    rmSync(join(app.dir, MIGRATIONS_FILE), { force: true });
  }
  if (apps.length > 1 || apps[0].dir !== worktree.path) ctx.log(`Apps: ${apps.map((app) => app.label).join(', ')}.`);
  return apps;
};

/**
 * @param {import('./upgrade.type.mjs').UpgradePlan} plan
 * @param {{ review: boolean }} choice
 * @param {import('../workspace/workspace.type.mjs').ThreadContext} ctx
 * @returns {Promise<number>} 0 green, 1 red
 */
const upgradeInWorktree = async (plan, { review }, ctx) => {
  const name = worktreeNameFor(plan.target);
  ctx.log(`Upgrading Brock ${plan.current ?? 'unknown'} to ${plan.target} in the worktree ${name}.`);
  if (plan.mode === 'link') ctx.log(`Brock is linked to ${plan.checkout}, so the upgrade follows that checkout: sync, migrations and the gate.`);
  await createVerb.run([name], {}, ctx);
  const worktree = { name, path: worktreePathFor(name, ctx.workspace), branch: `${ctx.workspace.branchPrefix}${name}` };
  const apps = prepareApps(worktree, plan, ctx);
  const fields = bumpApp(worktree.path, plan, apps.map((app) => app.dir));
  ctx.log(fields.length > 0 ? `package.json: ${fields.join(', ')}` : 'package.json already names this version.');
  const { results, failed, changelog } = runGate(worktree, { plan, apps }, { review, log: ctx.log });
  const reports = writeReports({ app: ctx.workspace.name, plan, worktree, apps }, { fields, steps: results, failed }, changelog);
  for (const report of reports) ctx.log(`Report: ${report}`);
  if (failed) {
    ctx.log(`Red: the ${failed} step failed. The worktree stays at ${worktree.path}. Fix it there, then run ${ctx.workspace.name} upgrade again.`);
    return 1;
  }
  await commitUpgrade(worktree, { plan, report: reports[0] }, ctx);
  return 0;
};

export { upgradeInWorktree };
