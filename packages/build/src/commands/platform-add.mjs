/* @layer tooling-scripts @kind logic */
import { loadBrockConfig } from '../load-config.mjs';
import { addTarget } from '../platforms/add-target.mjs';
import { checkMachine } from '../platforms/check-machine.mjs';
import { runPlatformPhase } from '../platforms/run-platform-phase.mjs';
import { secretsChecklist } from '../platforms/secrets-checklist.mjs';
import { runPnpm } from '../run.mjs';
import { findWorkspaceRoot } from '../workspace.mjs';
import { configTargets } from './config-targets.mjs';
import { runSync } from './sync.mjs';

const say = (lines) => {
  for (const line of lines) console.log(line);
};

/**
 * @param {string} rootDir
 * @param {import('../config.mjs').BrockConfig} config
 * @param {string[]} inputs
 * @returns {Promise<number>} failed steps
 */
const scaffoldAdded = async (rootDir, config, inputs) => {
  const files = await runPlatformPhase({ rootDir, config, phase: 'files', only: inputs });
  say(['brock platform: files', ...files.lines]);
  if (files.install) {
    const code = await runPnpm(findWorkspaceRoot(rootDir) ?? rootDir, ['install']);
    if (code !== 0) throw new Error(`pnpm install exited ${code}`);
  }
  const synced = await runSync({ rootDir });
  if (synced !== 0) return 1;
  const tools = await runPlatformPhase({ rootDir, config, phase: 'tools', only: inputs });
  say(['brock platform: tools', ...tools.lines]);
  return files.failed + tools.failed;
};

/**
 * @param {string} rootDir
 * @param {string[]} inputs ids and bundles, already checked
 * @returns {Promise<number>} exit code
 */
const runPlatformAdd = async (rootDir, inputs) => {
  const { targets, write } = configTargets(rootDir);
  const next = inputs.reduce(addTarget, targets);
  console.log(write(next) ? `brock platform: targets ${targets.join(', ')} -> ${next.join(', ')}` : `brock platform: targets already cover ${inputs.join(', ')}; running the steps again`);
  const config = await loadBrockConfig(rootDir);
  const failed = await scaffoldAdded(rootDir, config, inputs);
  const machine = checkMachine({ rootDir, targets: inputs, modules: config.modules });
  say(['', 'brock doctor:', ...machine.lines]);
  const secrets = secretsChecklist(inputs);
  if (secrets.length) say(['', ...secrets]);
  if (failed) console.error(`brock platform: ${failed} step(s) failed; fix the cause and run platform add again, the steps skip what is done.`);
  return failed ? 1 : 0;
};

export { runPlatformAdd };
