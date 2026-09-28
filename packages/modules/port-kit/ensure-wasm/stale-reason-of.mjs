/* @layer tooling-scripts @kind logic */

/**
 * @param {{ outputTimes: number[], sourceTimes: number[] }} times mtimes in ms
 * @returns {string | null} why the core needs a build, or null when current
 */
const staleReasonOf = ({ outputTimes, sourceTimes }) => {
  if (outputTimes.length === 0 || outputTimes.some((time) => !(time > 0))) return 'the core output is missing';
  const oldestOutput = Math.min(...outputTimes);
  const newestSource = sourceTimes.reduce((newest, time) => Math.max(newest, time), 0);
  return newestSource > oldestOutput ? 'sources changed since the last build' : null;
};

export { staleReasonOf };
