/* @layer tooling-scripts @kind logic */
import { expandTargets } from './expand-targets.mjs';
import { BUNDLES } from './platforms.constants.mjs';

/**
 * @param {string[]} current the targets as written
 * @param {string} input an id or a bundle
 * @returns {string[]} the targets to write, bundles kept as written
 */
const addTarget = (current, input) => {
  const members = BUNDLES[input];
  if (members) return current.includes(input) ? current : [...current.filter((token) => !members.includes(token)), input];
  return expandTargets(current).platforms.includes(input) ? current : [...current, input];
};

export { addTarget };
