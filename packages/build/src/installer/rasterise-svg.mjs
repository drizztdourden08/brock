/* @layer tooling-scripts @kind logic */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { SPLASH_FONT } from './installer.constants.mjs';

/**
 * @param {string} svg @param {number} width @param {string[]} fontFiles
 * @returns {Buffer}
 */
const render = (svg, width, fontFiles) => new Resvg(svg, {
  fitTo: { mode: 'width', value: width },
  font: { loadSystemFonts: true, defaultFontFamily: SPLASH_FONT, fontFiles },
}).render().asPng();

/**
 * @param {string} svg
 * @param {number} width  output width in pixels
 * @param {Buffer | null} [ttf]  a TrueType font the SVG names, beside the system fonts
 * @returns {Buffer}  a PNG
 */
const rasteriseSvg = (svg, width, ttf = null) => {
  if (!ttf) return render(svg, width, []);
  const dir = mkdtempSync(join(tmpdir(), 'brock-font-'));
  try {
    const file = join(dir, 'font.ttf');
    writeFileSync(file, ttf);
    return render(svg, width, [file]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

export { rasteriseSvg };
