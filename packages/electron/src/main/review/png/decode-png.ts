/* @layer electron-main @kind logic */
import { inflateSync } from 'zlib';
import type { ReviewBitmap } from '@drizztdourden08/brock-core/review';
import { BIT_DEPTH, CHANNELS, CHUNK_CRC, CHUNK_HEADER, OPAQUE, PNG_SIGNATURE, RGBA } from './png.constants';
import type { PngHeader } from './png.type';
import { unfilterRows } from './unfilter-rows';

const readHeader = (data: Buffer): PngHeader => {
  const [depth, color, , , interlace] = data.subarray(8, 13);
  const channels = CHANNELS[color ?? -1];
  if (depth !== BIT_DEPTH || channels === undefined || interlace !== 0) {
    throw new Error(`only 8-bit RGB or RGBA PNGs without interlace are read (depth ${depth}, color type ${color}, interlace ${interlace})`);
  }
  return { width: data.readUInt32BE(0), height: data.readUInt32BE(4), channels };
};

const readChunks = (png: Buffer): { header: PngHeader; pixels: Buffer } => {
  if (!png.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) throw new Error('not a PNG file');
  let header: PngHeader | null = null;
  const parts: Buffer[] = [];
  for (let at = PNG_SIGNATURE.length; at < png.length;) {
    const length = png.readUInt32BE(at);
    const type = png.toString('latin1', at + 4, at + CHUNK_HEADER);
    const data = png.subarray(at + CHUNK_HEADER, at + CHUNK_HEADER + length);
    if (type === 'IHDR') header = readHeader(data);
    if (type === 'IDAT') parts.push(data);
    if (type === 'IEND') break;
    at += CHUNK_HEADER + length + CHUNK_CRC;
  }
  if (!header) throw new Error('the PNG has no header chunk');
  return { header, pixels: inflateSync(Buffer.concat(parts)) };
};

const toRgba = (rows: Uint8Array, { width, height, channels }: PngHeader): Uint8Array => {
  if (channels === RGBA) return rows;
  const out = new Uint8Array(width * height * RGBA);
  for (let pixel = 0; pixel < width * height; pixel += 1) {
    out.set(rows.subarray(pixel * channels, pixel * channels + channels), pixel * RGBA);
    out[pixel * RGBA + RGBA - 1] = OPAQUE;
  }
  return out;
};

const decodePng = (png: Buffer): ReviewBitmap => {
  const { header, pixels } = readChunks(png);
  const stride = header.width * header.channels;
  const rows = unfilterRows(pixels, header.height, stride, header.channels);
  return { width: header.width, height: header.height, data: toRgba(rows, header) };
};

export { decodePng };
