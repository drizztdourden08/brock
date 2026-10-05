/* @layer tooling-scripts @kind logic */

/**
 * @param {number} flag @param {number} base
 * @returns {number}  base, negative unless the flag's low bit is set
 */
const withSign = (flag, base) => ((flag & 1) ? base : -base);

/**
 * @param {number} flag  0 to 127
 * @returns {number}  how many glyph stream bytes the point takes
 */
const tripletLength = (flag) => {
  if (flag < 84) return 1;
  if (flag < 120) return 2;
  return flag < 124 ? 3 : 4;
};

/**
 * @param {number} flag @param {Buffer} b  the point's bytes
 * @returns {[number, number]}  dx and dy for flags 20 and up
 */
const wideTriplet = (flag, b) => {
  if (flag < 84) {
    const high = flag - 20;
    return [withSign(flag, 1 + (high & 0x30) + (b[0] >> 4)), withSign(flag >> 1, 1 + ((high & 0x0c) << 2) + (b[0] & 0x0f))];
  }
  if (flag < 120) {
    const high = flag - 84;
    return [withSign(flag, 1 + (Math.floor(high / 12) << 8) + b[0]), withSign(flag >> 1, 1 + (((high % 12) >> 2) << 8) + b[1])];
  }
  if (flag < 124) return [withSign(flag, (b[0] << 4) + (b[1] >> 4)), withSign(flag >> 1, ((b[1] & 0x0f) << 8) + b[2])];
  return [withSign(flag, (b[0] << 8) + b[1]), withSign(flag >> 1, (b[2] << 8) + b[3])];
};

/**
 * @param {number} flag  the point flag without its on-curve bit
 * @param {import('./byte-reader.mjs').ByteReader} glyphStream
 * @returns {[number, number]}  the point's dx and dy, per the WOFF2 triplet table
 */
const readTriplet = (flag, glyphStream) => {
  const b = glyphStream.bytes(tripletLength(flag));
  if (flag < 10) return [0, withSign(flag, ((flag & 14) << 7) + b[0])];
  if (flag < 20) return [withSign(flag, (((flag - 10) & 14) << 7) + b[0]), 0];
  return wideTriplet(flag, b);
};

export { readTriplet };
