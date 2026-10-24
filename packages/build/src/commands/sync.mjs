/* @layer tooling-scripts @kind logic */
import { relative } from 'node:path';
import { CONFIG_FILE } from '../config.mjs';
import { isSiteDir } from '../site/load-site.mjs';
import { repoRootOf, siteDirs } from '../site/site-dirs.mjs';
import { syncSites } from '../site/sync-sites.mjs';
import { ensureSynced } from '../freshness/ensure-synced.mjs';
import { syncBrandIgnores } from '../icons/brand-ignores.mjs';
import { wordmarkHeightWarnings } from '../installer/wordmark-height-warnings.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { moduleTypeProblem } from '../managed/module-type-problem.mjs';
import { menuConfigProblems, menuConfigWarnings } from '../menu/menu-config-problems.mjs';
import { syncApp } from '../modules/sync.mjs';
import { workflowInputs } from '../release/workspace-workflow-inputs.mjs';
import { workflowProblems } from '../release/workflow-problems.mjs';
import { writeGuide } from '../tessera/write-guide.mjs';
import { syncTargets } from './sync-targets.mjs';

const reportProblems = (problems, header) => {
  if (!problems.length) return 0;
  console.error(header);
  for (const problem of problems) console.error(`  ${problem}`);
  return 1;
};

const managedConfigProblems = (appDir) => {
  const problem = moduleTypeProblem(appDir);
  return problem ? [problem] : [];
};

const reportCheck = (result, label) => {
  if (!result.drifted.length) {
    console.log(`brock check: ${label} is in sync (${result.modules.length} module(s)).`);
    return 0;
  }
  console.error(`brock check: ${result.drifted.length} managed file(s) drifted in ${label}:`);
  for (const path of result.drifted) console.error(`  ${path}`);
  console.error('Run `brock sync` to regenerate them.');
  return 1;
};

const reportSync = (result, label) => {
  if (!result.written.length) console.log(`brock sync: ${label} already in sync.`);
  else {
    console.log(`brock sync: wrote ${result.written.length} file(s) in ${label}:`);
    for (const path of result.written) console.log(`  ${path}`);
  }
  for (const m of result.modules) console.log(`  module ${m.id} <- ${m.package}@${m.version}`);
  return 0;
};

const syncOne = async (appDir, check) => {
  const config = await loadBrockConfig(appDir);
  const result = syncApp(appDir, config, { check, ...(await workflowInputs(appDir)) });
  const label = relative(process.cwd(), appDir) || '.';
  const code = check ? reportCheck(result, label) : reportSync(result, label);
  const prefix = check ? 'brock check' : 'brock sync';
  const problems = Math.max(
    reportProblems(workflowProblems(appDir, result.workflows), `${prefix}: the managed workflows of ${label} would not run as written:`),
    reportProblems(managedConfigProblems(appDir), `${prefix}: the managed configs of ${label} would not load:`),
    reportProblems(menuConfigProblems(appDir, config.product?.menu), `${prefix}: the menu config of ${label} has problems:`),
  );
  const warnings = [...menuConfigWarnings(config.product?.menu), ...wordmarkHeightWarnings(appDir, config.product ?? {})];
  for (const warning of warnings) console.warn(`${prefix}: warning: ${warning}`);
  return check ? Math.max(code, problems) : code;
};

const syncIfStale = async (appDir) => {
  const problem = await ensureSynced(appDir, 'brock sync');
  if (!problem) return 0;
  console.error(`brock sync: ${problem}`);
  return 1;
};

/**
 * @param {{ rootDir: string, check?: boolean, ifStale?: boolean }} ctx
 * @returns {Promise<number>} exit code
 */
const syncApps = async (apps, staleOnly, check) => {
  let code = 0;
  for (const appDir of apps) code = Math.max(code, await (staleOnly ? syncIfStale(appDir) : syncOne(appDir, check)));
  return code;
};

const syncIconIgnores = async (repoRoot) => {
  const apps = await syncTargets(repoRoot);
  const branded = await Promise.all(apps.map(async (appDir) => ((await loadBrockConfig(appDir)).product?.icons?.brand ? relative(repoRoot, appDir).replace(/\\/g, '/') : null)));
  if (syncBrandIgnores(repoRoot, branded.filter((path) => path !== null))) console.log('brock sync: updated .gitignore (generated icon files)');
};

const runSync = async ({ rootDir, check = false, ifStale = false }) => {
  const repoRoot = repoRootOf(rootDir);
  if (isSiteDir(rootDir)) return syncSites(repoRoot, { check, only: [relative(repoRoot, rootDir).replace(/\\/g, '/')] });
  const apps = await syncTargets(rootDir);
  if (!apps.length && !siteDirs(repoRoot).length) throw new Error(`No ${CONFIG_FILE} in ${rootDir}, and no electron target in brock.workspace.mjs points at an app.`);
  const staleOnly = ifStale && !check;
  let code = await syncApps(apps, staleOnly, check);
  if (staleOnly) return code;
  if (!check) await syncIconIgnores(repoRoot);
  code = Math.max(code, await syncSites(repoRoot, { check }));
  if (!check) await writeGuide(rootDir);
  return code;
};

export { runSync };
