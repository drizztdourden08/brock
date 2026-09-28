/* @layer tooling-scripts @kind logic */
import { crc32 } from 'node:zlib';

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

/**
 * @param {Buffer} buf
 * @returns {{ type: string, data: Buffer }[]}
 */
const readPngChunks = (buf) => {
  if (!buf.subarray(0, 8).equals(PNG_SIGNATURE)) throw new Error('not a PNG file');
  const chunks = [];
  let offset = 8;
  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    chunks.push({ type: buf.toString('latin1', offset + 4, offset + 8), data: buf.subarray(offset + 8, offset + 8 + length) });
    offset += length + 12;
  }
  return chunks;
};

/**
 * @param {string} type
 * @param {Buffer} data
 * @returns {Buffer}
 */
const pngChunk = (type, data) => {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, 'latin1');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, crc]);
};

export { PNG_SIGNATURE, readPngChunks, pngChunk };
