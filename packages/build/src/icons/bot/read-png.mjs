/* @layer tooling-scripts @kind logic */
import pngjs from 'pngjs';

/**
 * @typedef {{ width: number, height: number, pixels: Uint8Array }} RgbaImage  Straight alpha, 4 bytes a pixel
 */

/**
 * @param {Buffer} buf
 * @returns {RgbaImage}
 */
const readPng = (buf) => {
  const { width, height, data } = pngjs.PNG.sync.read(buf);
  return { width, height, pixels: new Uint8Array(data) };
};

export { readPng };
