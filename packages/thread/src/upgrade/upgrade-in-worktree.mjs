/* @layer tooling-scripts @kind logic */
import { rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { git } from '../git.mjs';
import { jsonFile } from '../provision/json-file.mjs';
import { createVerb } from '../worktree/create.mjs';
import { commitVerb } from '../worktree/commit.mjs';
import { excludeLocally } from '../worktree/exclude-worktrees.mjs';
import { worktreePathFor } from '../worktree/paths.mjs';
import { bumpApp } from './bump-app.mjs';
import { changelogBetween } from './changelog-between.mjs';
import { gateSteps } from './gate-steps.mjs';
import { renderReport } from './render-report.mjs';
import { runIn } from './run-in.mjs';
import { runSteps } from './run-steps.mjs';
import { tesseraBefore } from './tessera-before.mjs';
import { MIGRATIONS_FILE, REPORT_FILE, WORKTREE_PREFIX } from './upgrade.constants.mjs';

const worktreeNameFor = (version) => `${WORKTREE_PREFIX}${version.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const installStep = (path) => ({
  name: 'pnpm install',
  skipped: 'package.json matches the base branch',
  run: () => (git(['status', '--porcelain', '--', 'package.json'], path) ? runIn.pnpm(path, ['install', '--no-frozen-lockfile']) : null),
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

const runGate = (worktree, plan, { review, log }) => {
  const tesseraFrom = tesseraBefore(worktree.path);
  const install = runSteps([installStep(worktree.path)], log);
  const changelog = changelogBetween(worktree.path, { from: plan.current, to: plan.target, online: plan.mode === 'registry' });
  printChangelog(changelog, plan, log);
  if (install.failed) return { results: install.results, failed: install.failed, changelog };
  const gate = runSteps(gateSteps({ ...worktree, plan, review, tesseraFrom }), log);
  return { results: [...install.results, ...gate.results], failed: gate.failed, changelog };
};

const commitUpgrade = async (worktree, plan, ctx) => {
  if (!git(['status', '--porcelain'], worktree.path)) {
    ctx.log('Nothing changed in the app, so there is nothing to commit.');
    return;
  }
  await commitVerb.run([worktree.name], { message: `Upgrade Brock to ${plan.target}` }, ctx);
  const title = `"Upgrade Brock to ${plan.target}"`;
  ctx.log(`Green. Open the pull request with: ${ctx.workspace.name} pr open ${worktree.name} --title ${title} --body-file ${join(worktree.path, REPORT_FILE)}`);
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
  excludeLocally(ctx.rootDir, `/${REPORT_FILE}`);
  rmSync(join(worktree.path, MIGRATIONS_FILE), { force: true });
  const fields = bumpApp(worktree.path, plan);
  ctx.log(fields.length > 0 ? `package.json: ${fields.join(', ')}` : 'package.json already names this version.');
  const { results, failed, changelog } = runGate(worktree, plan, { review, log: ctx.log });
  const migrations = jsonFile(join(worktree.path, MIGRATIONS_FILE)).read();
  const report = renderReport({ app: ctx.workspace.name, plan, worktree }, { fields, steps: results, failed }, { migrations, changelog });
  writeFileSync(join(worktree.path, REPORT_FILE), report, 'utf8');
  ctx.log(`Report: ${join(worktree.path, REPORT_FILE)}`);
  if (failed) {
    ctx.log(`Red: the ${failed} step failed. The worktree stays at ${worktree.path}. Fix it there, then run ${ctx.workspace.name} upgrade again.`);
    return 1;
  }
  await commitUpgrade(worktree, plan, ctx);
  return 0;
};

export { upgradeInWorktree };
