/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { APP_THEME_CSS } from '../look/look.constants.mjs';
import { TOKEN_FILES, TOKEN_LAYERS, TOKENS_DIR } from './splash.constants.mjs';

/**
 * @param {string} rootDir  The app root
 * @param {string} tesseraRoot  The installed Tessera package folder
 * @returns {string}  Tessera's token stylesheets, then the app's palette seeds
 */
const readTokenCss = (rootDir, tesseraRoot) => {
  const tokens = TOKEN_FILES.map((name) => readFileSync(join(tesseraRoot, TOKENS_DIR, name), 'utf8'));
  const theme = join(rootDir, APP_THEME_CSS);
  return [TOKEN_LAYERS, ...tokens, existsSync(theme) ? readFileSync(theme, 'utf8') : ''].join('\n');
};

export { readTokenCss };
