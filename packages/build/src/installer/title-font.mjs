/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FONTS_DIR } from '../splash/splash.constants.mjs';
import { fontFamily } from './font-family.mjs';
import { SPLASH_FONT, TITLE_TTF } from './installer.constants.mjs';

/**
 * @typedef {{ family: string, file: string }} TitleFont  family: the name the TrueType file declares; file: its path
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
 * @returns {TitleFont | null}  Tessera's TrueType title font, or null if unreadable
 */
const titleFont = (tesseraRoot) => {
  try {
    const file = join(tesseraRoot, FONTS_DIR, TITLE_TTF);
    const family = fontFamily(readFileSync(file));
    if (!family) throw new Error(`${TITLE_TTF} names no family`);
    return { family, file };
  } catch (error) {
    warnOnce(tesseraRoot, error);
    return null;
  }
};

export { titleFont };
