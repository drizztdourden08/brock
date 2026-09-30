/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} dir the folder holding the template
 * @param {string} name the template file
 * @param {Record<string, string>} values each __KEY__ becomes its value
 * @returns {string}
 */
const fillTemplate = (dir, name, values) =>
  Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`__${key}__`, value),
    readFileSync(join(dir, name), 'utf8').replace(/\r\n/g, '\n'),
  );

export { fillTemplate };
