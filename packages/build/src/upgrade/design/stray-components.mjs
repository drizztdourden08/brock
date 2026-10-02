/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { BROCK_APP_DIRS, PART_DIRS } from './design.constants.mjs';

const COMPONENT_FILE = /^[A-Z][A-Za-z0-9]*\.tsx$/;

const componentsIn = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const path = join(dir, entry.name);
  if (entry.isDirectory()) return existsSync(join(path, `${entry.name}.tsx`)) ? [path] : componentsIn(path);
  return COMPONENT_FILE.test(entry.name) ? [path] : [];
});

/**
 * @param {{ src: string }[]} apps
 * @returns {string[]} components outside the parts folders
 */
const strayComponents = (apps) => apps.flatMap((app) => {
  if (!existsSync(app.src)) return [];
  return readdirSync(app.src, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !PART_DIRS.includes(entry.name) && !BROCK_APP_DIRS.includes(entry.name))
    .flatMap((entry) => componentsIn(join(app.src, entry.name)));
});

export { strayComponents };
