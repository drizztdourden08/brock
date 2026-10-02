/* @layer tooling-scripts @kind logic */
import { appThemeCss } from './app-theme-css.mjs';
import { tesseraConfigModule } from './tessera-config-module.mjs';

/**
 * @param {string} rootDir  The repo root
 * @returns {string[]}  the repo theme and each apps entry theme
 */
const tesseraThemes = (rootDir) => {
  const config = tesseraConfigModule(rootDir)?.loadTesseraConfig(rootDir);
  if (!config) return [];
  return [...new Set([appThemeCss(rootDir), ...config.apps.map(appThemeCss)])];
};

export { tesseraThemes };
