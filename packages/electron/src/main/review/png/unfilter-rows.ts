/* @layer electron-main @kind logic */
import { FILTER_AVERAGE, FILTER_NONE, FILTER_PAETH, FILTER_SUB, FILTER_UP } from './png.constants';

const byteAt = (bytes: Uint8Array, index: number): number => bytes[index] ?? 0;

const paeth = (left: number, up: number, upLeft: number): number => {
  const estimate = left + up - upLeft;
  const toLeft = Math.abs(estimate - left);
  const toUp = Math.abs(estimate - up);
  const toUpLeft = Math.abs(estimate - upLeft);
  if (toLeft <= toUp && toLeft <= toUpLeft) return left;
  return toUp <= toUpLeft ? up : upLeft;
};

const predictor = (filter: number, left: number, up: number, upLeft: number): number => {
  switch (filter) {
    case FILTER_NONE: return 0;
    case FILTER_SUB: return left;
    case FILTER_UP: return up;
    case FILTER_AVERAGE: return Math.floor((left + up) / 2);
    case FILTER_PAETH: return paeth(left, up, upLeft);
    default: throw new Error(`the PNG uses an unknown row filter ${filter}`);
  }
};

const unfilterRow = (raw: Uint8Array, out: Uint8Array, y: number, { stride, bpp }: { stride: number; bpp: number }): void => {
  const filter = byteAt(raw, y * (stride + 1));
  const from = y * (stride + 1) + 1;
  const start = y * stride;
  const above = start - stride;
  for (let x = 0; x < stride; x += 1) {
    const left = x >= bpp ? byteAt(out, start + x - bpp) : 0;
    const up = y > 0 ? byteAt(out, above + x) : 0;
    const upLeft = y > 0 && x >= bpp ? byteAt(out, above + x - bpp) : 0;
    out[start + x] = (byteAt(raw, from + x) + predictor(filter, left, up, upLeft)) & 0xff;
  }
};

const unfilterRows = (raw: Uint8Array, height: number, stride: number, bpp: number): Uint8Array => {
  const out = new Uint8Array(height * stride);
  for (let y = 0; y < height; y += 1) unfilterRow(raw, out, y, { stride, bpp });
  return out;
};

export { unfilterRows };
