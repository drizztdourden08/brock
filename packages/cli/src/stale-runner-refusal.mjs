/* @layer tooling-scripts @kind logic */
import { runnerPackage } from './runner-package.mjs';
import { GITHUB_VERBS } from './thread-verbs.constants.mjs';

/**
 * @param {string | undefined} command the first word after brock
 * @param {boolean} localMode whether the coord remote switch is local
 * @param {string} runnerBin the bin that would run the command
 * @param {(bin: string) => import('./runner-package.mjs').RunnerPackage} [describe]
 * @returns {string | null} the one-line refusal, or null when the command may run
 */
const staleRunnerRefusal = (command, localMode, runnerBin, describe = runnerPackage) => {
  if (!localMode || !GITHUB_VERBS.has(command)) return null;
  const runner = describe(runnerBin);
  if (runner.hasLocalMode) return null;
  return `brock: refused "${command}". Local mode is on and ${runner.label} does not know it, so it would reach GitHub. Update the global brock (npm install -g @drizztdourden08/brock) or run the project's own command.\n`;
};

export { staleRunnerRefusal };
