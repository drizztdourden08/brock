/* @layer tooling-scripts @kind logic */

const segmentOf = (segment) => {
  const clean = segment.replace(/[^A-Za-z0-9_]/g, '_');
  return /^[A-Za-z_]/.test(clean) ? clean : `_${clean}`;
};

/**
 * @param {{ appId: string }} product
 * @returns {string} the reverse-DNS app id as a valid Java package name
 */
const androidAppId = (product) => product.appId.split('.').map(segmentOf).join('.');

export { androidAppId };
