/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const TEMPLATE = join(import.meta.dirname, 'launcher.mjs.tmpl');
const NAME_RULE = /^[a-z][a-z0-9-]{0,30}$/;

/**
 * @param {string} name
 * @returns {string}
 */
const launcherSource = (name) => {
  if (!NAME_RULE.test(name)) throw new Error(`"${name}" is not a command name (a lowercase word: letters, digits, dashes)`);
  return readFileSync(TEMPLATE, 'utf8').replace(/\r\n/g, '\n').replace('__NAME__', name);
};

export { launcherSource };
