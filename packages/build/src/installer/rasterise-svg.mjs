/* @layer tooling-scripts @kind logic */
import { Resvg } from '@resvg/resvg-js';
import { SPLASH_FONT } from './installer.constants.mjs';

/**
 * @param {string} svg
 * @param {number} width  output width in pixels
 * @returns {Buffer}  a PNG
 */
const rasteriseSvg = (svg, width) => new Resvg(svg, {
  fitTo: { mode: 'width', value: width },
  font: { loadSystemFonts: true, defaultFontFamily: SPLASH_FONT },
}).render().asPng();

export { rasteriseSvg };
