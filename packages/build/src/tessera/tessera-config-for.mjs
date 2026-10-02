/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { appDirs } from '../commands/app-dirs.mjs';
import { DESIGN_DIR, SHARED_KINDS, TESSERA_SCHEMA_REF } from './tessera.constants.mjs';

const appEntry = (rootDir, app) => ({
  parts: { views: `${app}/src/views` },
  ...(existsSync(join(rootDir, app, 'src', 'theme.css')) ? { theme: { css: `${app}/src/theme.css` } } : {}),
});

/**
 * @param {string} rootDir  The repo root
 * @param {string} [designPackage]  such as @acme/design; none for one app
 * @returns {Record<string, unknown>}  the tessera.config.json content
 */
const tesseraConfigFor = (rootDir, designPackage) => {
  if (!designPackage) return { $schema: TESSERA_SCHEMA_REF };
  const apps = appDirs(rootDir).filter((app) => app !== '.');
  return {
    $schema: TESSERA_SCHEMA_REF,
    package: designPackage,
    parts: Object.fromEntries(SHARED_KINDS.map((kind) => [kind, `${DESIGN_DIR}/src/${kind}`])),
    stories: `${DESIGN_DIR}/stories`,
    apps: Object.fromEntries(apps.map((app) => [app, appEntry(rootDir, app)])),
  };
};

export { tesseraConfigFor };
