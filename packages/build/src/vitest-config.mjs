/* @layer tooling-scripts @kind config */
import { importFromApp } from './import-from-app.mjs';
import { vitestBase } from './vitest/vitest-base.mjs';

/**
 * @param {string} rootDir The app root, or a repo root
 * @param {Record<string, unknown>} [overrides] Merged over the base config
 * @returns {Promise<Record<string, unknown>>}
 */
const defineBrockVitestConfig = async (rootDir, overrides = {}) => {
  const { mergeConfig } = await importFromApp(rootDir, 'vite');
  return mergeConfig(await vitestBase(rootDir), overrides);
};

export { defineBrockVitestConfig };
