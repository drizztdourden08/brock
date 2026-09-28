/* @layer tooling-scripts @kind logic */

/**
 * @param {number} a @param {number} b @param {number} c
 */
const paeth = (a, b, c) => {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
};

/**
 * @param {number} filter @param {number} left @param {number} up @param {number} corner
 */
const predict = (filter, left, up, corner) => {
  switch (filter) {
    case 0: return 0;
    case 1: return left;
    case 2: return up;
    case 3: return Math.floor((left + up) / 2);
    case 4: return paeth(left, up, corner);
    default: throw new Error(`unknown PNG filter ${filter}`);
  }
};

/**
 * @param {Buffer} raw  Inflated IDAT data
 * @param {number} width @param {number} height @param {number} bpp
 * @returns {Uint8Array}
 */
const unfilterScanlines = (raw, width, height, bpp) => {
  const stride = width * bpp;
  const out = new Uint8Array(stride * height);
  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x += 1) {
      const at = y * stride + x;
      const left = x >= bpp ? out[at - bpp] : 0;
      const up = y > 0 ? out[at - stride] : 0;
      const corner = x >= bpp && y > 0 ? out[at - stride - bpp] : 0;
      out[at] = (raw[y * (stride + 1) + 1 + x] + predict(filter, left, up, corner)) & 0xff;
    }
  }
  return out;
};

export { unfilterScanlines };
