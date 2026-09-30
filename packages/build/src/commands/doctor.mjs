/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { CONFIG_FILE } from '../config.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { checkMachine } from '../platforms/check-machine.mjs';
import { DEFAULT_TARGETS } from '../platforms/platforms.constants.mjs';
import { targetInputProblem } from '../platforms/target-input-problem.mjs';

/**
 * @param {string} rootDir
 * @returns {Promise<{ targets: string[], modules: string[] }>}
 */
const appTargets = async (rootDir) => {
  if (!existsSync(join(rootDir, CONFIG_FILE))) return { targets: DEFAULT_TARGETS, modules: [] };
  const config = await loadBrockConfig(rootDir);
  return { targets: config.targets, modules: config.modules };
};

/**
 * @param {{ rootDir: string, args?: string[] }} ctx args name platforms; none checks the app's targets
 * @returns {Promise<number>} 0 when nothing is missing
 */
const runDoctorCommand = async ({ rootDir, args = [] }) => {
  const problem = args.length ? targetInputProblem(args) : null;
  if (problem) {
    console.error(`brock doctor: ${problem}`);
    return 1;
  }
  const app = await appTargets(rootDir);
  const targets = args.length ? args : app.targets;
  const machine = checkMachine({ rootDir, targets, modules: app.modules });
  console.log(`brock doctor: ${machine.platforms.join(', ') || 'no platform'} on ${process.platform} (checks only, installs nothing)\n`);
  for (const line of machine.lines) console.log(line);
  return machine.ok ? 0 : 1;
};

export { runDoctorCommand };
