/* @layer tooling-scripts @kind config */
import { importFromApp } from './import-from-app.mjs';
import { findAppDir } from './vitest/find-app-dir.mjs';
import { vitestBase } from './vitest/vitest-base.mjs';

const viteOf = async (rootDir, appDir) => {
  try {
    return await importFromApp(rootDir, 'vite');
  } catch {
    return importFromApp(appDir, 'vite');
  }
};

/**
 * @param {string} rootDir The app, or a workspace root
 * @param {Record<string, unknown>} [overrides] Merged over the base config
 * @param {{ appDir?: string }} [options] appDir: the app with react, for a workspace root
 * @returns {Promise<Record<string, unknown>>}
 */
const defineBrockVitestConfig = async (rootDir, overrides = {}, { appDir } = {}) => {
  const app = findAppDir(rootDir, appDir);
  const { mergeConfig } = await viteOf(rootDir, app);
  return mergeConfig(await vitestBase(rootDir, app), overrides);
};

export { defineBrockVitestConfig };
