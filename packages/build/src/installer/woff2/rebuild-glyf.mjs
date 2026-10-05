/* @layer tooling-scripts @kind logic */
import { compositeGlyph } from './composite-glyph.mjs';
import { glyfStreams } from './glyf-streams.mjs';
import { simpleGlyph } from './simple-glyph.mjs';
import { COMPOSITE_CONTOURS } from './woff2.constants.mjs';

/**
 * @param {import('./glyf-streams.mjs').GlyfStreams} glyf
 * @param {number} glyph
 * @returns {Buffer}  one glyph, padded to 4 bytes
 */
const glyphAt = (glyf, glyph) => {
  const contours = glyf.streams.nContour.i16();
  if (contours === 0) return Buffer.alloc(0);
  const data = contours === COMPOSITE_CONTOURS ? compositeGlyph(glyf.streams) : simpleGlyph(glyf, glyph, contours);
  return Buffer.concat([data, Buffer.alloc((4 - (data.length % 4)) % 4)]);
};

/**
 * @param {number[]} offsets @param {number} indexFormat  0 for short offsets, 1 for long
 * @returns {Buffer}  the loca table
 */
const locaOf = (offsets, indexFormat) => {
  const width = indexFormat ? 4 : 2;
  const loca = Buffer.alloc(offsets.length * width);
  offsets.forEach((offset, index) => (indexFormat ? loca.writeUInt32BE(offset, index * 4) : loca.writeUInt16BE(offset / 2, index * 2)));
  return loca;
};

/**
 * @param {Buffer} data  the transformed glyf table
 * @returns {{ glyf: Buffer, loca: Buffer }}  both tables in TrueType form
 */
const rebuildGlyf = (data) => {
  const glyf = glyfStreams(data);
  const glyphs = Array.from({ length: glyf.numGlyphs }, (_, glyph) => glyphAt(glyf, glyph));
  const offsets = [0];
  for (const glyph of glyphs) offsets.push(offsets.at(-1) + glyph.length);
  return { glyf: Buffer.concat(glyphs), loca: locaOf(offsets, glyf.indexFormat) };
};

export { rebuildGlyf };
