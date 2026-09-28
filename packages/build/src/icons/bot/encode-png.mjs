/* @layer tooling-scripts @kind logic */
import { deflateSync } from 'node:zlib';
import { PNG_SIGNATURE, pngChunk } from './png-chunks.mjs';

/**
 * @param {import('./decode-png.mjs').RgbaImage} image
 * @returns {Buffer}
 */
const encodePng = ({ width, height, pixels }) => {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) raw.set(pixels.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header.set([8, 6, 0, 0, 0], 8);
  return Buffer.concat([
    PNG_SIGNATURE,
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
};

export { encodePng };
