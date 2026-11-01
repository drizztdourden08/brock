/* @layer tooling-scripts @kind logic */

/**
 * @param {{ steps: { name: string, status: string, exitCode: number | null, note?: string }[] }} record
 * @returns {string} one plain line for the run
 */
const summarize = (record) => {
  const ran = record.steps.filter((step) => step.status !== 'skipped-local');
  const passed = ran.filter((step) => step.status === 'pass').length;
  const failed = record.steps.find((step) => step.status === 'fail' || step.status === 'timeout');
  const cached = record.steps.filter((step) => step.cachedFrom).length;
  const skipped = record.steps.length - ran.length;
  const parts = [`${passed} of ${ran.length} step(s) passed`];
  if (failed) parts.push(failed.status === 'timeout' ? `${failed.name} timed out` : `${failed.name} failed (exit ${failed.exitCode})`);
  if (cached) parts.push(`${cached} cached`);
  if (failed?.note) parts.push(failed.note);
  if (skipped) parts.push(`${skipped} skipped-local`);
  return `${parts.join('; ')}.`;
};

export { summarize };
