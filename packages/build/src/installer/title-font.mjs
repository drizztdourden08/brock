/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { FONTS_DIR, TITLE_FONT } from '../splash/splash.constants.mjs';
import { SPLASH_FONT } from './installer.constants.mjs';
import { fontFamily } from './woff2/font-family.mjs';
import { woff2ToTtf } from './woff2/woff2-to-ttf.mjs';

/**
 * @typedef {{ family: string, ttf: Buffer }} TitleFont  family: the name the TrueType file declares
 */

const warned = new Set();

/**
 * @param {string} tesseraRoot @param {unknown} error
 */
const warnOnce = (tesseraRoot, error) => {
  if (warned.has(tesseraRoot)) return;
  warned.add(tesseraRoot);
  console.log(`brock: the Setup splash name falls back to ${SPLASH_FONT}: Tessera's title font did not load (${error instanceof Error ? error.message : String(error)})`);
};

/**
 * @param {string} tesseraRoot  The installed Tessera package folder
 * @returns {TitleFont | null}  the title font as TrueType, or null if unreadable
 */
const titleFont = (tesseraRoot) => {
  try {
    const ttf = woff2ToTtf(readFileSync(join(tesseraRoot, FONTS_DIR, dirname(TITLE_FONT.css), TITLE_FONT.file)));
    const family = fontFamily(ttf);
    if (!family) throw new Error(`${TITLE_FONT.file} names no family`);
    return { family, ttf };
  } catch (error) {
    warnOnce(tesseraRoot, error);
    return null;
  }
};

export { titleFont };
