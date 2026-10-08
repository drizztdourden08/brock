/* @layer core @kind logic */
import type { MaskRect } from './baseline.type';

const clampTo = (value: number, max: number): number => Math.min(Math.max(value, 0), max);

const maskGrid = (width: number, height: number, rects: readonly MaskRect[]): Uint8Array => {
  const grid = new Uint8Array(width * height);
  for (const rect of rects) {
    const left = clampTo(Math.floor(rect.x), width);
    const top = clampTo(Math.floor(rect.y), height);
    const right = clampTo(Math.ceil(rect.x + rect.width), width);
    const bottom = clampTo(Math.ceil(rect.y + rect.height), height);
    for (let y = top; y < bottom; y += 1) grid.fill(1, y * width + left, y * width + right);
  }
  return grid;
};

export { maskGrid };
