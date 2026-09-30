/* @layer tooling-scripts @kind logic */
import { expandTargets } from './expand-targets.mjs';
import { BUNDLES } from './platforms.constants.mjs';

/**
 * @param {string[]} current the targets as written
 * @param {string} input an id or a bundle
 * @returns {string[]} a bundle losing a member becomes its other members
 */
const removeTarget = (current, input) => {
  const removed = new Set(expandTargets([input]).platforms);
  const next = current.flatMap((token) => {
    if (token === input) return [];
    const members = BUNDLES[token];
    if (!members) return removed.has(token) ? [] : [token];
    return members.some((id) => removed.has(id)) ? members.filter((id) => !removed.has(id)) : [token];
  });
  return [...new Set(next)];
};

export { removeTarget };
