/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { CONFIG_FILE } from '../config.mjs';
import { ensureSynced } from '../freshness/ensure-synced.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { syncApp } from '../modules/sync.mjs';
import { hasGuideParts } from '../tessera/has-guide-parts.mjs';
import { TESSERA_CONFIG_FILE } from '../tessera/tessera.constants.mjs';
import { findWorkspaceRoot } from '../workspace.mjs';
import { syncTargets } from './sync-targets.mjs';
import { runTesseraCommand } from './tessera.mjs';

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

const configDirOf = (rootDir) => (existsSync(join(rootDir, TESSERA_CONFIG_FILE)) ? rootDir : findWorkspaceRoot(rootDir) ?? rootDir);

const writePartNames = async (rootDir) => {
  const configDir = configDirOf(rootDir);
  if (!hasGuideParts(configDir)) return;
  console.log('brock sync: tessera.config.json sets guide.parts, running tessera guide.');
  const code = await runTesseraCommand({ args: ['guide'], cwd: configDir });
  if (code !== 0) console.warn('brock sync: tessera guide reported problems; brock tessera check lists them.');
};

/**
 * @param {{ rootDir: string, check?: boolean, ifStale?: boolean }} ctx
 * @returns {Promise<number>} exit code
 */
const runSync = async ({ rootDir, check = false, ifStale = false }) => {
  const apps = await syncTargets(rootDir);
  if (!apps.length) throw new Error(`No ${CONFIG_FILE} in ${rootDir}, and no electron target in brock.workspace.mjs points at an app.`);
  let code = 0;
  for (const appDir of apps) code = Math.max(code, await (ifStale && !check ? syncIfStale(appDir) : syncOne(appDir, check)));
  if (!check && !ifStale) await writePartNames(rootDir);
  return code;
};

export { runSync };
