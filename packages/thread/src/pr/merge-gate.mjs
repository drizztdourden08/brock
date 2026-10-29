/* @layer tooling-scripts @kind logic */

/**
 * @param {object | null} run the newest check-run record of the head commit
 * @param {{ sha: string, alias: string, pr: string | null }} head
 * @returns {string | null} why the merge is refused, or null when it may go ahead
 */
const mergeBlocker = (run, { sha, alias, pr }) => {
  const short = sha.slice(0, 9);
  if (!run) return `There is no check run for ${short}. Run: ${alias} ci --commit ${sha}${pr ? ` --pr ${pr}` : ''}`;
  if (run.status === 'queued' || run.status === 'running') return `The check run ${run.id} of ${short} is still ${run.status}.`;
  if (run.partial) return `The latest check run ${run.id} of ${short} ran only some steps (--only). Run the whole check.`;
  const required = (run.steps ?? []).filter((step) => step.required);
  if (required.length === 0) return `The check run ${run.id} of ${short} has no required step to pass.`;
  const notPassing = required.filter((step) => step.status !== 'pass');
  if (notPassing.length === 0) return null;
  return `Required step(s) not passing in check run ${run.id} of ${short}: ${notPassing.map((step) => `${step.name} (${step.status})`).join(', ')}.`;
};

export { mergeBlocker };
