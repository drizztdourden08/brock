/* @layer tooling-scripts @kind logic */
import { byteReader } from './byte-reader.mjs';
import { GLYF_HEADER_SIZE, GLYF_STREAMS, OVERLAP_SIMPLE_OPTION } from './woff2.constants.mjs';

/**
 * @typedef {object} GlyfStreams
 * @property {number} numGlyphs @property {number} indexFormat
 * @property {Record<string, import('./byte-reader.mjs').ByteReader>} streams  nContour, nPoints, flag, glyph, composite, bbox, instruction
 * @property {(glyph: number) => boolean} hasBbox  the glyph's box is stored, not computed
 * @property {(glyph: number) => boolean} overlaps  the glyph sets OVERLAP_SIMPLE
 */

/**
 * @param {Buffer | null} bitmap @param {number} glyph
 * @returns {boolean}
 */
const bitOf = (bitmap, glyph) => Boolean(bitmap && bitmap[glyph >> 3] & (0x80 >> (glyph & 7)));

/**
 * @param {Buffer} data  the transformed glyf table
 * @returns {GlyfStreams}
 */
const glyfStreams = (data) => {
  const header = byteReader(data);
  header.u16();
  const options = header.u16();
  const numGlyphs = header.u16();
  const indexFormat = header.u16();
  const sizes = GLYF_STREAMS.map(() => header.u32());
  let at = GLYF_HEADER_SIZE;
  const parts = sizes.map((size) => {
    const part = data.subarray(at, at + size);
    at += size;
    return part;
  });
  const bitmapLength = ((numGlyphs + 31) >> 5) << 2;
  const bboxBitmap = parts[5].subarray(0, bitmapLength);
  parts[5] = parts[5].subarray(bitmapLength);
  const overlapBitmap = options & OVERLAP_SIMPLE_OPTION ? data.subarray(at, at + ((numGlyphs + 7) >> 3)) : null;
  const streams = Object.fromEntries(GLYF_STREAMS.map((name, index) => [name, byteReader(parts[index])]));
  return { numGlyphs, indexFormat, streams, hasBbox: (glyph) => bitOf(bboxBitmap, glyph), overlaps: (glyph) => bitOf(overlapBitmap, glyph) };
};

export { glyfStreams };
