/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { FONTS_DIR, SPLASH_FONTS } from './splash.constants.mjs';

/**
 * @param {string} tesseraRoot  The installed Tessera package folder
 * @returns {string}  Tessera's @font-face rules, files inlined
 */
const readSplashFonts = (tesseraRoot) => SPLASH_FONTS.map(({ css, file }) => {
  const cssPath = join(tesseraRoot, FONTS_DIR, css);
  const face = readFileSync(cssPath, 'utf8').match(/@font-face\s*\{[^}]*\}/g)?.find((rule) => rule.includes(`./${file}`));
  if (!face) throw new Error(`Tessera's ${css} has no @font-face for ${file}`);
  const data = readFileSync(join(dirname(cssPath), file)).toString('base64');
  return face.replace(`./${file}`, `data:font/woff2;base64,${data}`);
}).join('\n');

export { readSplashFonts };
