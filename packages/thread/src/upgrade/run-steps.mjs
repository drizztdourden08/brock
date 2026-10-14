/* @layer tooling-scripts @kind logic */

/**
 * @param {{ name: string }[]} steps
 * @param {string} failed
 * @returns {import('./upgrade.type.mjs').StepResult[]} each step after the failed one, listed as not run
 */
const notRun = (steps, failed) => steps.map((step) => ({ name: step.name, status: 'not run', detail: `${failed} failed first` }));

/**
 * @param {{ name: string, run: () => number | null, skipped?: string }[]} steps
 * @param {(message: string) => void} log
 * @returns {{ results: import('./upgrade.type.mjs').StepResult[], failed: string | null }}
 */
const runSteps = (steps, log) => {
  const results = [];
  for (const [at, step] of steps.entries()) {
    log(`Step: ${step.name}`);
    const code = step.run();
    if (code === null) {
      results.push({ name: step.name, status: 'skipped', detail: step.skipped ?? 'not wanted' });
      continue;
    }
    results.push({ name: step.name, status: code === 0 ? 'passed' : 'failed', ...(code === 0 ? {} : { detail: `exit ${code}` }) });
    if (code !== 0) return { results: [...results, ...notRun(steps.slice(at + 1), step.name)], failed: step.name };
  }
  return { results, failed: null };
};

export { notRun, runSteps };
