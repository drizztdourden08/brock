/* @layer tooling-scripts @kind logic */
import { BUNDLES, PLATFORM_ORDER } from './platforms.constants.mjs';

/**
 * @param {string[]} targets ids and bundles, as brock.config.ts lists them
 * @returns {{ platforms: string[], unknown: string[] }} ids in canonical order
 */
const expandTargets = (targets) => {
  const wanted = new Set();
  const unknown = [];
  for (const token of targets) {
    const members = BUNDLES[token] ?? (PLATFORM_ORDER.includes(token) ? [token] : null);
    if (!members) unknown.push(token);
    else for (const id of members) wanted.add(id);
  }
  return { platforms: PLATFORM_ORDER.filter((id) => wanted.has(id)), unknown };
};

export { expandTargets };
