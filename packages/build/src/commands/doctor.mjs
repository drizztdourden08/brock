/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { CONFIG_FILE } from '../config.mjs';
import { runAppChecks } from '../doctor/run-app-checks.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { checkMachine } from '../platforms/check-machine.mjs';
import { DEFAULT_TARGETS } from '../platforms/platforms.constants.mjs';
import { targetInputProblem } from '../platforms/target-input-problem.mjs';

/**
 * @param {string} rootDir
 * @returns {Promise<{ targets: string[], modules: string[], config: import('../config.mjs').BrockConfig | null }>}
 */
const appTargets = async (rootDir) => {
  if (!existsSync(join(rootDir, CONFIG_FILE))) return { targets: DEFAULT_TARGETS, modules: [], config: null };
  const config = await loadBrockConfig(rootDir);
  return { targets: config.targets, modules: config.modules, config };
};

/**
 * @param {string} rootDir
 * @param {string[]} args
 * @param {{ targets: string[], modules: string[] }} app
 * @returns {boolean} true when nothing is missing on the machine
 */
const printMachine = (rootDir, args, app) => {
  const targets = args.length ? args : app.targets;
  const machine = checkMachine({ rootDir, targets, modules: app.modules });
  console.log(`brock doctor: ${machine.platforms.join(', ') || 'no platform'} on ${process.platform} (checks only, installs nothing)\n`);
  for (const line of machine.lines) console.log(line);
  return machine.ok;
};

/**
 * @param {string} rootDir
 * @param {import('../config.mjs').BrockConfig | null} config
 * @returns {Promise<boolean>} true when every app check is ok
 */
const printAppChecks = async (rootDir, config) => {
  const checks = await runAppChecks({ rootDir, config });
  console.log('\n  The app');
  for (const line of checks.lines) console.log(line);
  return checks.ok;
};

/**
 * @param {{ rootDir: string, args?: string[] }} ctx args name platforms; none also checks the app
 * @returns {Promise<number>} 0 when nothing is missing and every app check is ok
 */
const runDoctorCommand = async ({ rootDir, args = [] }) => {
  const problem = args.length ? targetInputProblem(args) : null;
  if (problem) {
    console.error(`brock doctor: ${problem}`);
    return 1;
  }
  const app = await appTargets(rootDir);
  const machineOk = printMachine(rootDir, args, app);
  if (args.length) return machineOk ? 0 : 1;
  const appOk = await printAppChecks(rootDir, app.config);
  return machineOk && appOk ? 0 : 1;
};

export { runDoctorCommand };
