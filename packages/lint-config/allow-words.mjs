/* @layer tooling-scripts @kind logic */

/**
 * @param {{ allow?: string[], prose?: { allow?: string[] } }} opts
 * @returns {string[]} the top-level allow words joined with the prose allow words
 */
const allowWords = (opts) => [...(opts.allow ?? []), ...(opts.prose?.allow ?? [])];

export { allowWords };
