/* @layer tooling-scripts @kind logic */
import { relative } from 'node:path';
import { CONFIG_FILE } from '../config.mjs';
import { runGate } from '../gate/run-gate.mjs';
import { workspaceGate } from '../gate/workspace-gate.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { syncTargets } from './sync-targets.mjs';

const gateTargets = async (rootDir) => {
  const apps = await syncTargets(rootDir);
  if (apps.length) return Promise.all(apps.map(async (appDir) => ({ appDir, config: await loadBrockConfig(appDir) })));
  const config = await workspaceGate(rootDir);
  if (config) return [{ appDir: rootDir, config }];
  throw new Error(`No ${CONFIG_FILE} in ${rootDir}, no electron target in brock.workspace.mjs points at an app, and there is no gate in brock.workspace.mjs or Cargo.toml at the root.`);
};

/**
 * @param {{ rootDir: string }} ctx an app root or a repo root
 * @returns {Promise<number>} exit code: 1 when a step of any app failed
 */
const runGateCommand = async ({ rootDir }) => {
  const failed = [];
  const cargoRoots = new Set();
  for (const { appDir, config } of await gateTargets(rootDir)) {
    const label = relative(process.cwd(), appDir) || '.';
    const steps = await runGate({ appDir, label, config, cargoRoots });
    failed.push(...steps.map((step) => `${label}: ${step}`));
  }
  if (!failed.length) return 0;
  console.error(`brock gate: ${failed.length} step(s) failed:`);
  for (const step of failed) console.error(`  ${step}`);
  return 1;
};

export { runGateCommand };
