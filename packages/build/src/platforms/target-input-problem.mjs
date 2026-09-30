/* @layer tooling-scripts @kind logic */
import { allPlatforms } from './all-platforms.mjs';
import { BUNDLES } from './platforms.constants.mjs';
import { resolvePlatforms } from './resolve-platforms.mjs';

/**
 * @param {string[]} inputs ids and bundles typed by a person
 * @returns {string | null} why they cannot be used, or null
 */
const targetInputProblem = (inputs) => {
  if (!inputs.length) return 'name a platform or a bundle';
  const { unsupported, unknown } = resolvePlatforms(inputs);
  if (unknown.length) {
    const ids = allPlatforms().map((platform) => (platform.supported ? platform.id : `${platform.id} (not supported yet)`));
    return `"${unknown.join('", "')}" is not a platform. Platforms: ${ids.join(', ')}. Bundles: ${Object.keys(BUNDLES).join(', ')}.`;
  }
  if (unsupported.length) {
    const labels = allPlatforms().filter((platform) => unsupported.includes(platform.id)).map((platform) => platform.label);
    return `${labels.join(', ')} is not supported yet. The id is reserved: the mobile bundle picks it up once it lands, with no config change.`;
  }
  return null;
};

export { targetInputProblem };
