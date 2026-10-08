/* @layer tooling-scripts @kind logic */
import { relative } from 'node:path';
import { CONFIG_FILE } from '../config.mjs';
import { runGate } from '../gate/run-gate.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { syncTargets } from './sync-targets.mjs';

/**
 * @param {{ rootDir: string }} ctx an app root, or a repo root with brock.workspace.mjs
 * @returns {Promise<number>} exit code: 1 when a step of any app failed
 */
const runGateCommand = async ({ rootDir }) => {
  const apps = await syncTargets(rootDir);
  if (!apps.length) throw new Error(`No ${CONFIG_FILE} in ${rootDir}, and no electron target in brock.workspace.mjs points at an app.`);
  const failed = [];
  for (const appDir of apps) {
    const label = relative(process.cwd(), appDir) || '.';
    const steps = await runGate({ appDir, label, config: await loadBrockConfig(appDir) });
    failed.push(...steps.map((step) => `${label}: ${step}`));
  }
  if (!failed.length) return 0;
  console.error(`brock gate: ${failed.length} step(s) failed:`);
  for (const step of failed) console.error(`  ${step}`);
  return 1;
};

export { runGateCommand };
