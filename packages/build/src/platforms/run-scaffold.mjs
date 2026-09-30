/* @layer tooling-scripts @kind logic */

/**
 * @typedef {import('./platform.type.mjs').ScaffoldStep} ScaffoldStep
 * @typedef {import('./platform.type.mjs').ScaffoldOutcome} ScaffoldOutcome
 * @typedef {{ platform: string, step: string, outcome: ScaffoldOutcome }} StepResult
 */

/**
 * @param {ScaffoldStep} step
 * @param {import('./platform.type.mjs').PlatformContext} ctx
 * @returns {Promise<ScaffoldOutcome>}
 */
const runStep = async (step, ctx) => {
  try {
    return await step.run(ctx);
  } catch (error) {
    return { status: 'failed', detail: error?.message ?? String(error) };
  }
};

/**
 * @param {import('./platform.type.mjs').Platform[]} platforms
 * @param {import('./platform.type.mjs').PlatformContext} ctx
 * @param {'files' | 'tools'} phase
 * @returns {Promise<StepResult[]>} a step shared by several platforms runs once
 */
const runScaffold = async (platforms, ctx, phase) => {
  const steps = platforms.flatMap((platform) => platform.scaffold.filter((step) => step.phase === phase).map((step) => ({ platform: platform.id, step })));
  const unique = steps.filter((entry, index) => steps.findIndex((other) => other.step.name === entry.step.name) === index);
  const results = [];
  for (const { platform, step } of unique) results.push({ platform, step: step.name, outcome: await runStep(step, ctx) });
  return results;
};

export { runScaffold };
