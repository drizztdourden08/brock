/* @layer tooling-scripts @kind logic */
import { Resvg } from '@resvg/resvg-js';
import { SPLASH_FONT } from './installer.constants.mjs';

/**
 * @param {string} svg
 * @param {number} width  output width in pixels
 * @param {string | null} [fontFile]  a TrueType font file the SVG names, beside the system fonts
 * @returns {Buffer}  a PNG
 */
const rasteriseSvg = (svg, width, fontFile = null) => new Resvg(svg, {
  fitTo: { mode: 'width', value: width },
  font: { loadSystemFonts: true, defaultFontFamily: SPLASH_FONT, fontFiles: fontFile ? [fontFile] : [] },
}).render().asPng();

export { rasteriseSvg };
