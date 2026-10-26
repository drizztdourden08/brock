/* @layer tooling-scripts @kind logic */
import { runPnpm } from '../run.mjs';
import { CARGO_MISSING } from './cargo.constants.mjs';
import { gateSteps } from './gate-steps.mjs';
import { runCargo } from './run-cargo.mjs';
import { runClangFormat } from './run-clang-format.mjs';
import { runRustComments } from './run-rust-comments.mjs';

const missingCargo = (log) => {
  log(`  ${CARGO_MISSING}`);
  return 1;
};

const runStep = async (appDir, step, log) => {
  if (step.kind === 'script') return runPnpm(step.dir, ['run', step.script]);
  if (step.kind === 'cargo') return runCargo(step);
  if (step.kind === 'cargo-missing') return missingCargo(log);
  if (step.kind === 'rust-comments') return runRustComments({ dir: step.dir, log });
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
 * @param {{ appDir: string, label: string, config: import('../config.mjs').BrockConfig, log?: (line: string) => void, run?: typeof runStep, env?: NodeJS.ProcessEnv, cargoRoots?: Set<string> }} opts
 * @returns {Promise<string[]>} the failed steps; every step runs
 */
const runGate = async ({ appDir, label, config, log = console.log, run = attempt, env, cargoRoots }) => {
  const steps = gateSteps(appDir, config, { env, cargoRoots });
  if (!steps.length) {
    log(`brock gate: ${label} declares no gate steps (gate.scripts, gate.clangFormat, gate.cargo in brock.config.ts, or a Cargo.toml).`);
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
