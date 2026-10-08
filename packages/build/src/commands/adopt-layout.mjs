/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { DESIGN_DIR } from '../tessera/tessera.constants.mjs';
import { appDirs } from './app-dirs.mjs';

const APP_CODE = 'src/screens, src/widgets, src/views, src/boot, src/stores, src/hooks';

/**
 * @param {string} rootDir the repo root
 * @returns {string[]} where each kind of code goes
 */
const layoutLines = (rootDir) => {
  const apps = appDirs(rootDir).filter((app) => app !== '.');
  if (apps.length === 0) return [`  layout: ${APP_CODE}; Tessera parts in src/primitives, src/composites, src/compounds`];
  const design = existsSync(join(rootDir, DESIGN_DIR, 'package.json'))
    ? `shared Tessera parts in ${DESIGN_DIR}/src/<kind>, and views two or more apps use in ${DESIGN_DIR}/src/views`
    : `shared Tessera parts go in a ${DESIGN_DIR} package (src/primitives, src/composites, src/compounds); create it, then set package and parts in tessera.config.json`;
  return [`  layout: each app (${apps.join(', ')}) keeps ${APP_CODE}; ${design}`];
};

export { layoutLines };
