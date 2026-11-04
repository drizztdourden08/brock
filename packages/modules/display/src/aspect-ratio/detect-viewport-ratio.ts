/* @layer core @kind logic */
import type { RatioLimits, RatioPair } from './aspect-ratio.type';
import { clampAndReduce } from './clamp-and-reduce';
import { viewportDims } from './viewport-dims';

const detectViewportRatio = (limits: RatioLimits, letterbox = false): RatioPair => {
  const { long, short } = viewportDims(letterbox);
  return clampAndReduce(long, short, limits);
};

export { detectViewportRatio };
