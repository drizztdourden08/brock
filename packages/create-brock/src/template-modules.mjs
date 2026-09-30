/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const MODULES_ARRAY = /modules:\s*\[([^\]]*)\]/;
const MODULE_ID = /['"]([^'"]+)['"]/g;

/**
 * @param {string} templateDir
 * @returns {string[]}
 */
const templateModules = (templateDir) => {
  const body = MODULES_ARRAY.exec(readFileSync(join(templateDir, 'brock.config.ts'), 'utf8'))?.[1] ?? '';
  return [...body.matchAll(MODULE_ID)].map((match) => match[1]);
};

export { templateModules };
