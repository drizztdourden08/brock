/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const BRAND = /icons:\s*\{[^}]*\bbrand:\s*['"]([^'"]+)['"]/;

/**
 * @param {string} templateDir
 * @returns {{ brand?: string }} the template's product.icons
 */
const templateIcons = (templateDir) => {
  const brand = BRAND.exec(readFileSync(join(templateDir, 'brock.config.ts'), 'utf8'))?.[1];
  return brand ? { brand } : {};
};

export { templateIcons };
