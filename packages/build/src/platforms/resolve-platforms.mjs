/* @layer tooling-scripts @kind logic */
import { allPlatforms } from './all-platforms.mjs';
import { expandTargets } from './expand-targets.mjs';

/**
 * @param {string[]} targets ids and bundles
 * @returns {{ platforms: import('./platform.type.mjs').Platform[], unsupported: string[], unknown: string[] }}
 */
const resolvePlatforms = (targets) => {
  const { platforms: ids, unknown } = expandTargets(targets);
  const chosen = allPlatforms().filter((platform) => ids.includes(platform.id));
  return {
    platforms: chosen.filter((platform) => platform.supported),
    unsupported: chosen.filter((platform) => !platform.supported).map((platform) => platform.id),
    unknown,
  };
};

export { resolvePlatforms };
