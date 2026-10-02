/* @layer tooling-scripts @kind logic */
import { APP_ALIAS, BARE_IMPORT } from './design.constants.mjs';

const packageOf = (spec) => spec.split('/').slice(0, spec.startsWith('@') ? 2 : 1).join('/');

/**
 * @param {string} source
 * @returns {string[]} the packages it imports, no node: or @app/
 */
const bareImports = (source) => [...new Set([...source.matchAll(BARE_IMPORT)]
  .map((match) => match[2])
  .filter((spec) => !spec.startsWith('node:') && !spec.startsWith(APP_ALIAS))
  .map(packageOf))];

export { bareImports };
