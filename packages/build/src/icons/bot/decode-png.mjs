/* @layer tooling-scripts @kind logic */
import { inflateSync } from 'node:zlib';
import { readPngChunks } from './png-chunks.mjs';
import { unfilterScanlines } from './unfilter-scanlines.mjs';

/**
 * @typedef {{ width: number, height: number, pixels: Uint8Array }} RgbaImage  Straight alpha, 4 bytes a pixel
 */

/**
 * @param {Uint8Array} rgb @param {number} count
 * @returns {Uint8Array}
 */
const rgbToRgba = (rgb, count) => {
  const out = new Uint8Array(count * 4);
  for (let i = 0; i < count; i += 1) {
    out.set(rgb.subarray(i * 3, i * 3 + 3), i * 4);
    out[i * 4 + 3] = 255;
  }
  return out;
};

/**
 * @param {Buffer} buf
 * @returns {RgbaImage}
 */
const decodePng = (buf) => {
  const chunks = readPngChunks(buf);
  const header = chunks.find((chunk) => chunk.type === 'IHDR')?.data;
  if (!header) throw new Error('PNG has no IHDR chunk');
  const width = header.readUInt32BE(0);
  const height = header.readUInt32BE(4);
  const [depth, colorType, , , interlace] = header.subarray(8, 13);
  if (depth !== 8 || interlace !== 0 || (colorType !== 6 && colorType !== 2)) {
    throw new Error(`PNG must be 8-bit RGB or RGBA without interlacing (depth ${depth}, colour type ${colorType})`);
  }
  const bpp = colorType === 6 ? 4 : 3;
  const raw = inflateSync(Buffer.concat(chunks.filter((chunk) => chunk.type === 'IDAT').map((chunk) => chunk.data)));
  const pixels = unfilterScanlines(raw, width, height, bpp);
  return { width, height, pixels: bpp === 4 ? pixels : rgbToRgba(pixels, width * height) };
};

export { decodePng };
