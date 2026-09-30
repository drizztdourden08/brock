/* @layer tooling-scripts @kind logic */
import { resolveModules } from '../modules/resolve.mjs';
import { DEFAULT_TARGETS } from './platforms.constants.mjs';
import { resolvePlatforms } from './resolve-platforms.mjs';
import { runScaffold } from './run-scaffold.mjs';

/**
 * @param {{ rootDir: string, config: import('../config.mjs').BrockConfig, phase: 'files' | 'tools', only?: string[] }} opts
 * @returns {Promise<{ lines: string[], install: boolean, failed: number }>} only limits the run to those targets
 */
const runPlatformPhase = async ({ rootDir, config, phase, only }) => {
  const { platforms } = resolvePlatforms(only ?? config.targets ?? DEFAULT_TARGETS);
  const { modules } = resolveModules(rootDir, config.modules ?? []);
  const results = await runScaffold(platforms, { rootDir, config, modules }, phase);
  const width = Math.max(0, ...results.map((result) => result.step.length));
  const lines = results.map(({ platform, step, outcome }) =>
    `  ${platform.padEnd(8)} ${step.padEnd(width)}  ${outcome.status}${outcome.detail ? `: ${outcome.detail}` : ''}`);
  return {
    lines,
    install: results.some((result) => result.outcome.install),
    failed: results.filter((result) => result.outcome.status === 'failed').length,
  };
};

export { runPlatformPhase };
