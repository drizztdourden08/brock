/* @layer core @kind logic */
import { BYTES_PER_PIXEL, DIFF_COLOR, FADE_BASE, FADE_WEIGHT, MASK_COLOR } from './baseline.constants';
import type { BitmapDiff, MaskRect, ReviewBitmap } from './baseline.type';
import { maskGrid } from './mask-grid';

const samePixel = (a: Uint8Array, b: Uint8Array, at: number): boolean =>
  a[at] === b[at] && a[at + 1] === b[at + 1] && a[at + 2] === b[at + 2] && a[at + 3] === b[at + 3];

const paint = (out: Uint8Array, at: number, color: readonly number[]): void => {
  out.set(color, at);
};

const fade = (source: Uint8Array, out: Uint8Array, at: number): void => {
  const gray = ((source[at] ?? 0) + (source[at + 1] ?? 0) + (source[at + 2] ?? 0)) / 3;
  const value = Math.round(FADE_BASE + gray * FADE_WEIGHT);
  out[at] = value;
  out[at + 1] = value;
  out[at + 2] = value;
  out[at + 3] = 255;
};

const compareBitmaps = (baseline: ReviewBitmap, current: ReviewBitmap, rects: readonly MaskRect[]): BitmapDiff => {
  if (baseline.width !== current.width || baseline.height !== current.height) {
    throw new Error(`the sizes differ: baseline ${baseline.width}x${baseline.height}, capture ${current.width}x${current.height}`);
  }
  const { width, height } = current;
  const masked = maskGrid(width, height, rects);
  const out = new Uint8Array(width * height * BYTES_PER_PIXEL);
  let diffPixels = 0;
  let comparedPixels = 0;
  for (let pixel = 0; pixel < width * height; pixel += 1) {
    const at = pixel * BYTES_PER_PIXEL;
    if (masked[pixel] === 1) {
      paint(out, at, MASK_COLOR);
      continue;
    }
    comparedPixels += 1;
    if (samePixel(baseline.data, current.data, at)) {
      fade(current.data, out, at);
      continue;
    }
    diffPixels += 1;
    paint(out, at, DIFF_COLOR);
  }
  const ratio = comparedPixels === 0 ? 0 : diffPixels / comparedPixels;
  return { diffPixels, comparedPixels, ratio, diff: { width, height, data: out } };
};

export { compareBitmaps };
