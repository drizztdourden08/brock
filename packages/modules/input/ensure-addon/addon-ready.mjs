/* @layer tooling-scripts @kind logic */
const READY = new Set(['current', 'installed', 'built']);

/**
 * @param {import('./index.d.mts').EnsureResult} result
 * @returns {boolean}
 */
const addonReady = (result) => READY.has(result);

export { addonReady };
