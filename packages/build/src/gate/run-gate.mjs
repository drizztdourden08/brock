/* @layer tooling-scripts @kind logic */
import { runPnpm } from '../run.mjs';
import { gateSteps } from './gate-steps.mjs';
import { runClangFormat } from './run-clang-format.mjs';

const runStep = async (appDir, step, log) => {
  if (step.kind === 'script') return runPnpm(step.dir, ['run', step.script]);
  return runClangFormat({ appDir, entries: step.entries, check: true, log });
};

const attempt = async (appDir, step, log) => {
  try {
    return await runStep(appDir, step, log);
  } catch (error) {
    log(`  ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }
};

/**
 * @param {{ appDir: string, label: string, config: import('../config.mjs').BrockConfig, log?: (line: string) => void, run?: typeof runStep }} opts
 * @returns {Promise<string[]>} the failed steps; every step runs
 */
const runGate = async ({ appDir, label, config, log = console.log, run = attempt }) => {
  const steps = gateSteps(appDir, config);
  if (!steps.length) {
    log(`brock gate: ${label} declares no gate steps (gate.scripts, gate.clangFormat in brock.config.ts).`);
    return [];
  }
  const failed = [];
  for (const step of steps) {
    log(`brock gate: ${label}: ${step.name}`);
    if ((await run(appDir, step, log)) !== 0) failed.push(step.name);
  }
  return failed;
};

export { runGate };
