/* @layer tooling-scripts @kind logic */

/**
 * @param {import('./index.d.mts').AddonStateInput} input
 * @returns {import('./index.d.mts').AddonState}
 */
const addonStateOf = ({ marker, hasBuild, pins, platformArch, sourcesNewer }) => {
  if (!marker || !hasBuild) return 'missing';
  if (marker.buildKey !== pins.buildKey || `${marker.platform}-${marker.arch}` !== platformArch) return 'version-changed';
  if (marker.source !== 'prebuilt' && sourcesNewer()) return 'sources-edited';
  return 'current';
};

export { addonStateOf };
