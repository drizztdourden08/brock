/* @layer tooling-scripts @kind logic */
import { relative } from 'node:path';
import { CONFIG_FILE } from '../config.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { syncApp } from '../modules/sync.mjs';
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

/**
 * @param {{ rootDir: string, check?: boolean}} ctx
 * @returns {Promise<number>} exit code
 */
const runSync = async ({ rootDir, check = false }) => {
  const apps = await syncTargets(rootDir);
  if (!apps.length) throw new Error(`No ${CONFIG_FILE} in ${rootDir}, and no electron target in brock.workspace.mjs points at an app.`);
  let code = 0;
  for (const appDir of apps) code = Math.max(code, await syncOne(appDir, check));
  return code;
};

export { runSync };
