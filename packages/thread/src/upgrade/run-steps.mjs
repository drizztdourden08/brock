/* @layer tooling-scripts @kind logic */

/**
 * @param {{ name: string, run: () => number | null, skipped?: string }[]} steps
 * @param {(message: string) => void} log
 * @returns {{ results: import('./upgrade.type.mjs').StepResult[], failed: string | null }}
 */
const runSteps = (steps, log) => {
  const results = [];
  for (const step of steps) {
    log(`Step: ${step.name}`);
    const code = step.run();
    if (code === null) {
      results.push({ name: step.name, status: 'skipped', detail: step.skipped ?? 'not wanted' });
      continue;
    }
    results.push({ name: step.name, status: code === 0 ? 'passed' : 'failed', ...(code === 0 ? {} : { detail: `exit ${code}` }) });
    if (code !== 0) return { results, failed: step.name };
  }
  return { results, failed: null };
};

export { runSteps };
