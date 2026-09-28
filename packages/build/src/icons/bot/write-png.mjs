/* @layer tooling-scripts @kind logic */
import pngjs from 'pngjs';

/**
 * @param {import('./read-png.mjs').RgbaImage} image
 * @returns {Buffer}
 */
const writePng = ({ width, height, pixels }) => {
  const png = new pngjs.PNG({ width, height });
  png.data = Buffer.from(pixels);
  return pngjs.PNG.sync.write(png);
};

export { writePng };
