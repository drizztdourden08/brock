/* @layer tooling-scripts @kind logic */
import { relative } from 'node:path';
import { CONFIG_FILE } from '../config.mjs';
import { isSiteDir } from '../site/load-site.mjs';
import { repoRootOf, siteDirs } from '../site/site-dirs.mjs';
import { syncSites } from '../site/sync-sites.mjs';
import { ensureSynced } from '../freshness/ensure-synced.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { syncApp } from '../modules/sync.mjs';
import { writeGuide } from '../tessera/write-guide.mjs';
import { syncTargets } from './sync-targets.mjs';

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
  const result = syncApp(appDir, config, { check });
  const label = relative(process.cwd(), appDir) || '.';
  return check ? reportCheck(result, label) : reportSync(result, label);
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

const runSync = async ({ rootDir, check = false, ifStale = false }) => {
  const repoRoot = repoRootOf(rootDir);
  if (isSiteDir(rootDir)) return syncSites(repoRoot, { check, only: [relative(repoRoot, rootDir).replace(/\\/g, '/')] });
  const apps = await syncTargets(rootDir);
  if (!apps.length && !siteDirs(repoRoot).length) throw new Error(`No ${CONFIG_FILE} in ${rootDir}, and no electron target in brock.workspace.mjs points at an app.`);
  const staleOnly = ifStale && !check;
  let code = await syncApps(apps, staleOnly, check);
  if (staleOnly) return code;
  code = Math.max(code, await syncSites(repoRoot, { check }));
  if (!check) await writeGuide(rootDir);
  return code;
};

export { runSync };
