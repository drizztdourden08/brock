/* @layer core @kind logic */
import type { RatioLimits, RatioPair } from './aspect-ratio.type';
import { clampAndReduce } from './clamp-and-reduce';
import { viewportDims } from './viewport-dims';

const detectViewportRatio = (limits: RatioLimits, letterbox = false, keepOrientation = false): RatioPair => {
  const { long, short, portrait } = viewportDims(letterbox);
  return keepOrientation && portrait ? clampAndReduce(short, long, limits) : clampAndReduce(long, short, limits);
};

export { detectViewportRatio };
