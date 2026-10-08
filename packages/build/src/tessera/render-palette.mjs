/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TESSERA_PACKAGE } from '../icons/brand-files.mjs';
import { tesseraDir } from '../icons/tessera-dir.mjs';
import { PALETTE_FILE, PALETTE_HEADER } from './tessera.constants.mjs';

const installedDir = (rootDir) => {
  try {
    return tesseraDir(rootDir);
  } catch {
    return null;
  }
};

const hasPalette = (rootDir, brand) => {
  const dir = installedDir(rootDir);
  if (dir === null) return true;
  const target = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')).exports?.['./palettes/*'];
  return typeof target === 'string' && existsSync(join(dir, target.replace('*', `${brand}.css`)));
};

/**
 * @param {string} rootDir the app root
 * @param {{ product?: { icons?: { brand?: string } } }} config brock.config.ts
 * @returns {{ path: string, content: string }[]} .brock/palette.css for the brand
 */
const renderPaletteFile = (rootDir, config) => {
  const brand = config.product?.icons?.brand;
  const lines = [PALETTE_HEADER];
  if (brand && hasPalette(rootDir, brand)) lines.push(`@import url('${TESSERA_PACKAGE}/palettes/${brand}.css');`);
  return [{ path: PALETTE_FILE, content: `${lines.join('\n')}\n` }];
};

export { renderPaletteFile };
