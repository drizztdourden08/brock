/* @layer tooling-scripts @kind logic */
import { readTriplet } from './triplet.mjs';
import { ON_CURVE_FLAG, OVERLAP_SIMPLE_FLAG } from './woff2.constants.mjs';

/**
 * @typedef {{ x: number, y: number, dx: number, dy: number, onCurve: boolean }} GlyphPoint
 */

/**
 * @param {import('./glyf-streams.mjs').GlyfStreams['streams']} streams
 * @param {number} total
 * @returns {GlyphPoint[]}  the points, as deltas and as positions
 */
const readPoints = (streams, total) => {
  let x = 0;
  let y = 0;
  return Array.from({ length: total }, () => {
    const flag = streams.flag.u8();
    const [dx, dy] = readTriplet(flag & 0x7f, streams.glyph);
    x += dx;
    y += dy;
    return { x, y, dx, dy, onCurve: !(flag >> 7) };
  });
};

/**
 * @param {GlyphPoint[]} points
 * @returns {number[]}  xMin, yMin, xMax, yMax
 */
const boxOf = (points) => {
  if (!points.length) return [0, 0, 0, 0];
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
};

/**
 * @param {import('./glyf-streams.mjs').GlyfStreams} glyf
 * @param {number} glyph @param {number} contours
 * @returns {Buffer}  the glyph in TrueType form, coordinates as 16-bit deltas
 */
const simpleGlyph = ({ streams, hasBbox, overlaps }, glyph, contours) => {
  let total = 0;
  const ends = Array.from({ length: contours }, () => {
    total += streams.nPoints.u255();
    return total - 1;
  });
  const points = readPoints(streams, total);
  const instructions = streams.instruction.bytes(streams.glyph.u255());
  const box = hasBbox(glyph) ? [0, 1, 2, 3].map(() => streams.bbox.i16()) : boxOf(points);
  const out = Buffer.alloc(10 + 2 * contours + 2 + instructions.length + 5 * total);
  let at = out.writeInt16BE(contours, 0);
  for (const value of box) at = out.writeInt16BE(value, at);
  for (const end of ends) at = out.writeUInt16BE(end, at);
  at = out.writeUInt16BE(instructions.length, at);
  at += instructions.copy(out, at);
  points.forEach((point, index) => {
    const overlap = index === 0 && overlaps(glyph) ? OVERLAP_SIMPLE_FLAG : 0;
    at = out.writeUInt8((point.onCurve ? ON_CURVE_FLAG : 0) | overlap, at);
  });
  for (const point of points) at = out.writeInt16BE(point.dx, at);
  for (const point of points) at = out.writeInt16BE(point.dy, at);
  return out;
};

export { simpleGlyph };
