/* @layer tooling-scripts @kind logic */

const FAILED = new Set(['fail', 'timeout']);

/**
 * @param {{ steps: { status: string }[] }} record
 * @returns {string} the status of the whole run
 */
const finishedWith = (record) => {
  if (record.steps.some((step) => step.status === 'cancelled')) return 'cancelled';
  if (record.steps.some((step) => FAILED.has(step.status))) return 'fail';
  return record.steps.some((step) => step.status === 'pass') ? 'pass' : 'skipped-local';
};

const stepStatus = (code, { cancelled, timedOut }) => {
  if (cancelled) return 'cancelled';
  if (timedOut) return 'timeout';
  return code === 0 ? 'pass' : 'fail';
};

export { finishedWith, stepStatus };
