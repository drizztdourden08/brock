/* @layer tooling-scripts @kind logic */

/**
 * @param {import('./decode-png.mjs').RgbaImage} image
 * @param {number} x0 @param {number} y0 @param {number} factor
 * @returns {number[]}
 */
const averageBlock = ({ width, pixels }, x0, y0, factor) => {
  const sum = [0, 0, 0, 0];
  for (let i = 0; i < factor * factor; i += 1) {
    const at = ((y0 + Math.floor(i / factor)) * width + x0 + (i % factor)) * 4;
    const alpha = pixels[at + 3];
    for (let c = 0; c < 3; c += 1) sum[c] += pixels[at + c] * alpha;
    sum[3] += alpha;
  }
  const rgb = sum.slice(0, 3).map((value) => (sum[3] ? Math.round(value / sum[3]) : 0));
  return [...rgb, Math.round(sum[3] / (factor * factor))];
};

/**
 * @param {import('./decode-png.mjs').RgbaImage} image
 * @param {number} factor  Divides the width and height
 * @returns {import('./decode-png.mjs').RgbaImage}
 */
const downscale = (image, factor) => {
  const width = image.width / factor;
  const height = image.height / factor;
  const pixels = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) pixels.set(averageBlock(image, x * factor, y * factor, factor), (y * width + x) * 4);
  }
  return { width, height, pixels };
};

export { downscale };
