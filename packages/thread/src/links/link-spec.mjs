/* @layer tooling-scripts @kind logic */
import { resolve } from 'node:path';
import { LINK_PREFIX } from './links.constants.mjs';

/**
 * @param {string} dir the package folder
 * @returns {string} an absolute link: spec with forward slashes
 */
const linkSpec = (dir) => `${LINK_PREFIX}${resolve(dir).replace(/\\/g, '/')}`;

export { linkSpec };
