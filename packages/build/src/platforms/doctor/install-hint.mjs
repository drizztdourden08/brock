/* @layer tooling-scripts @kind logic */
import { INSTALL_HINTS } from './doctor.constants.mjs';

/**
 * @param {keyof typeof INSTALL_HINTS} key
 * @param {NodeJS.Platform} host
 * @returns {string}
 */
const installHint = (key, host) => {
  const hints = INSTALL_HINTS[key];
  return hints[host] ?? hints.all ?? Object.values(hints)[0] ?? '';
};

export { installHint };
