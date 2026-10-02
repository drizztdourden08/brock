/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { APP_THEME_CSS } from './look.constants.mjs';
import { tesseraConfigModule } from './tessera-config-module.mjs';

const unreadable = (file, error) => {
  const message = error instanceof Error ? error.message : String(error);
  const detail = message.startsWith(`${file}:`) ? message.slice(file.length + 1).trim() : message;
  return new Error(`${file}: ${detail}\nBrock reads theme.css from this file for the splash look and the installer; fix it or delete it.`, { cause: error });
};

/**
 * @param {string} rootDir  The app root
 * @returns {string}  theme.css of tessera.config.json, else src/theme.css
 */
const appThemeCss = (rootDir) => {
  const tessera = tesseraConfigModule(rootDir);
  if (!tessera) return join(rootDir, APP_THEME_CSS);
  try {
    return tessera.loadTesseraConfig(rootDir)?.theme.css ?? join(rootDir, APP_THEME_CSS);
  } catch (error) {
    throw unreadable(tessera.findTesseraConfig(rootDir), error);
  }
};

export { appThemeCss };
