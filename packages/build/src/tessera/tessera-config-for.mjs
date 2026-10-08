/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { appDirs } from '../commands/app-dirs.mjs';
import { siteDirs } from '../site/site-dirs.mjs';
import { DESIGN_DIR, SHARED_KINDS, SHARED_VIEWS_DIR } from './tessera.constants.mjs';
import { tesseraSchemaRef } from './tessera-schema-ref.mjs';

const hasSharedViews = (rootDir) => existsSync(join(rootDir, SHARED_VIEWS_DIR));

const appEntry = (rootDir, app) => ({
  parts: { views: hasSharedViews(rootDir) ? [`${app}/src/views`, SHARED_VIEWS_DIR] : `${app}/src/views` },
  ...(existsSync(join(rootDir, app, 'src', 'theme.css')) ? { theme: { css: `${app}/src/theme.css` } } : {}),
});

const sharedParts = (rootDir) => Object.fromEntries([
  ...SHARED_KINDS.map((kind) => [kind, `${DESIGN_DIR}/src/${kind}`]),
  ...(hasSharedViews(rootDir) ? [['views', SHARED_VIEWS_DIR]] : []),
]);

/**
 * @param {string} rootDir  The repo root
 * @param {string} [designPackage]  such as @acme/design; none for one app
 * @returns {Record<string, unknown>}  the tessera.config.json content
 */
const tesseraConfigFor = (rootDir, designPackage) => {
  const apps = [...appDirs(rootDir).filter((app) => app !== '.'), ...siteDirs(rootDir)];
  const appEntries = Object.fromEntries(apps.map((app) => [app, appEntry(rootDir, app)]));
  const $schema = tesseraSchemaRef(rootDir);
  if (!designPackage) return apps.length ? { $schema, apps: appEntries } : { $schema };
  return {
    $schema,
    package: designPackage,
    parts: sharedParts(rootDir),
    stories: `${DESIGN_DIR}/stories`,
    apps: appEntries,
  };
};

export { tesseraConfigFor };
