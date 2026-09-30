/* @layer tooling-scripts @kind logic */
/**
 * @param {import('../scan-screens.mjs').ScreenFile[]} files
 * @param {string[]} buckets
 * @returns {string} each bucket with the number of custom pages it holds
 */
const customPageCounts = (files, buckets) =>
  buckets.map((bucket) => `${bucket} ${files.filter((file) => file.kind === 'custom' && file.bucket === bucket).length}`).join(', ');

export { customPageCounts };
